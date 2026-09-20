import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { decrementStockForItems } from '../../utils/stock'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const orderId = String(body?.orderId || '').trim()

    if (!orderId) {
      throw createError({ statusCode: 400, statusMessage: 'شناسه سفارش الزامی است' })
    }

    await connectDB()
    const order = await Order.findById(orderId)
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: 'سفارش پیدا نشد' })
    }

    if (order.status === 'paid' || order.status === 'shipped') {
      return { ok: true, alreadyPaid: true, orderId: order._id.toString() }
    }

    if (order.status !== 'pending' || order.paymentMethod !== 'cod') {
      throw createError({ statusCode: 400, statusMessage: 'این سفارش برای پرداخت در محل نیست' })
    }

    if (!order.stockDecremented) {
      await decrementStockForItems(order.items)
      order.stockDecremented = true
      await order.save()
    }

    return {
      ok: true,
      orderId: order._id.toString(),
      amount: order.amount,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'ثبت سفارش ناموفق بود',
    })
  }
})
