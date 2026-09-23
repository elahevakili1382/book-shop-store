import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { User } from '../../models/User'
import { decrementStockForItems } from '../../utils/stock'
import { requireAuth } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  const session = requireAuth(event)

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
    if (order.userId && order.userId !== session.id) {
      throw createError({ statusCode: 403, statusMessage: 'این سفارش مال حساب دیگری است' })
    }
    if (order.status === 'paid' || order.status === 'shipped') {
      return { ok: true, alreadyPaid: true, orderId: order._id.toString() }
    }
    if (order.status !== 'pending' || order.paymentMethod !== 'wallet') {
      throw createError({ statusCode: 400, statusMessage: 'این سفارش با کیف پول قابل پرداخت نیست' })
    }
    if (!order.amount || order.amount <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'مبلغ نامعتبر است' })
    }

    const charged = await User.findOneAndUpdate(
      { _id: session.id, walletBalance: { $gte: order.amount } },
      { $inc: { walletBalance: -order.amount } },
      { new: true },
    )

    if (!charged) {
      throw createError({ statusCode: 400, statusMessage: 'موجودی کیف پول کافی نیست' })
    }

    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, status: 'pending', paymentMethod: 'wallet' },
      { $set: { status: 'paid', userId: session.id, stockDecremented: true } },
      { new: true },
    )

    if (!claimed) {
      await User.updateOne({ _id: session.id }, { $inc: { walletBalance: order.amount } })
      return { ok: true, alreadyPaid: true, orderId: order._id.toString() }
    }

    try {
      await decrementStockForItems(claimed.items)
    } catch (err) {
      await Order.updateOne(
        { _id: claimed._id },
        { $set: { status: 'pending', stockDecremented: false } },
      )
      await User.updateOne({ _id: session.id }, { $inc: { walletBalance: claimed.amount } })
      throw err
    }

    return {
      ok: true,
      orderId: claimed._id.toString(),
      amount: claimed.amount,
      walletBalance: charged.walletBalance ?? 0,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'پرداخت با کیف پول ناموفق بود',
    })
  }
})
