import { defineEventHandler, createError, getQuery } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { format } from 'node:path'

type Range = 'week' | 'month' | 'year'
const PAID_STATUSES = ['paid', 'shipped'] as const

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(d: Date, days: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1)
}

function daykey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function monthKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function yearKey(d: Date) {
  return String(d.getFullYear())
}

//جمه مبلغ سفارش های پرداخت شده بین دو تا تاریخ 
async function sumInRange(from: Date, to: Date) {
    const rows = await Order.aggregate<{_id:null; total:number}>([

      {
  $match:{
    createdAt:{$gte: from, $lt: to},
    status:{$in:[...PAID_STATUSES]}
  },
},

{
  $group:{
    _id:null, //جمع کل
    total:{ $sum: '$amount'},// نتیجه را برای  هر سند جمع می زند 
  },
},
])
return rows[0]?.total ?? 0
}

function growthRate(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const raw = getQuery(event).range
    const range: Range =
      raw === 'month' ? 'month' : raw === 'year' ? 'year' : 'week'

    const now = new Date()
    const tomorrow = addDays(startOfDay(now), 1)

    let startCurrent: Date
    let startPrevious: Date
    let endPrevious: Date
    let buckets: { key: string; label: string }[] = []
    let groupFormat: string

    if(range === 'week'){
        startCurrent = startOfDay(addDays(now, -6))
      startPrevious = addDays(startCurrent, -7)
      endPrevious = startCurrent
      groupFormat = '%Y-%m-%d'

      for(let i =0; i<7; i++){
        const day = addDays(startCurrent,i)
        buckets.push({
          key: daykey(day),
          label:day.toLocaleDateString('fa-IR', {weekday:'short'})

        })
      }
    }

  else if (range === 'month') {
      startCurrent = startOfMonth(addMonths(now, -11))
      startPrevious = startOfMonth(addMonths(startCurrent, -12))
      endPrevious = startCurrent
      groupFormat = '%Y-%m'

      for (let i = 0; i < 12; i++) {
        const month = addMonths(startCurrent, i)
        buckets.push({
          key: monthKey(month),
          label: month.toLocaleDateString('fa-IR', { month: 'short' }),
        })
      }
    } else {
      const year = now.getFullYear()
      startCurrent = new Date(year - 3, 0, 1)
      startPrevious = new Date(year - 7, 0, 1)
      endPrevious = startCurrent
      groupFormat = '%Y'

      for (let y = year - 3; y <= year; y++) {
        const d = new Date(y, 0, 1)
        buckets.push({
          key: yearKey(d),
          label: d.toLocaleDateString('fa-IR', { year: 'numeric' }),
        })
      }
    }

  const rows = await Order.aggregate<{_id:string; total:number}>([
    {
      $match:{
        createdAt:{$gte: startCurrent, $lt: tomorrow},
        status:{$in:[...PAID_STATUSES]},
      },
    },

   {
    $group:{
      _id:{
     $dateToString:{
      format:groupFormat,
      date:'$createdAt',
     },
      },
      total:
       {$sum: '$amount'},
      
    },
   },
    {$sort:{_id:1}}
  ])
//فقط روز ها و ماه هایی که سفارش داشتند رو بر میگردونه 
  const byKey = new Map(
    rows.map((r) => [r._id, r.total])
  )

   const categories = buckets.map((b) => b.label)
   const series = buckets.map((b) =>byKey.get(b.key) ?? 0)

   const currentTotal = series.reduce((sum,n) => sum + n, 0)
   const previousTotal = await sumInRange(startPrevious, endPrevious)



    return {
      categories,
      series,
      growthRate: growthRate(currentTotal, previousTotal),
    }
  } catch (err) {
    const hint =
      err instanceof Error && err.message.includes('MONGODB')
        ? err.message
        : 'آمار فروش دریافت نشد — اتصال Mongo را در .env بررسی کن'
    throw createError({
      statusCode: 500,
      statusMessage: hint,
    })
  }
})
