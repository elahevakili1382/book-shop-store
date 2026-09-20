import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { requireAdmin } from '../../utils/requireAuth'

const PAID_STATUSES = ['paid', 'shipped'] as const

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1)
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  try {
    await connectDB()

    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const lastMonthStart = startOfMonth(addMonths(now, -1))
    const twoMonthsAgoStart = startOfMonth(addMonths(now, -2))

    // current month revenue
    const currentMonthRows = await Order.aggregate<{ _id: null; total: number }>([
      {
        $match: {
          createdAt: { $gte: currentMonthStart },
          status: { $in: [...PAID_STATUSES] },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])
    const currentMonthRevenue = currentMonthRows[0]?.total ?? 0

    // last month revenue
    const lastMonthRows = await Order.aggregate<{ _id: null; total: number }>([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
          status: { $in: [...PAID_STATUSES] },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])
    const lastMonthRevenue = lastMonthRows[0]?.total ?? 0

    // all paid orders count + total
    const allPaid = await Order.aggregate<{ _id: null; total: number; count: number }>([
      {
        $match: { status: { $in: [...PAID_STATUSES] } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ])

    const totalRevenue = allPaid[0]?.total ?? 0
    const paidOrdersCount = allPaid[0]?.count ?? 0
    const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0

    // growth rate
    const growthRate =
      lastMonthRevenue === 0
        ? currentMonthRevenue > 0 ? 100 : 0
        : Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)

    return {
      totalRevenue,
      averageOrderValue,
      paidOrdersCount,
      currentMonthRevenue,
      lastMonthRevenue,
      growthRate,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'خطا در دریافت آمار درآمد',
    })
  }
})