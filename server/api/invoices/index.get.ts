import {defineEventHandler , createError, getQuery} from 'h3'
import {connectDB} from '../../utils/mongodb'
import {Invoice} from '../../models/Invoice'
import {requireAdmin} from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try{
    requireAdmin(event)
    await connectDB()

    const query = getQuery(event)

    
    const limitRaw = query.limit
    const limit = typeof limitRaw === 'string' && /^\d+$/.test(limitRaw) ? Math.min(parseInt(limitRaw,10),50): 10


    const invoices = await Invoice.find().sort({createdAt:-1}).limit(limit).lean()

    return invoices.map((inv) =>({
      ...inv,
      _id: inv._id.toString(),
      id: inv._id.toString(),
    }))
    
  } catch (err: any){
    if(err?. statusCode) throw err
    throw createError({
      statusCode:500,
      statusMessage:'Failed to fetch invoices'
    })
  }
})
