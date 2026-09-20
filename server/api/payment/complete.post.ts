import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { decrementStockForItems } from '../../utils/stock'

const MERCHANT_ID = '00000000-0000-0000-0000-000000000000'

type ZarinpalVerifyResponse = {
  data?: {
    code?: number
    ref_id?: number
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const authority = String(body?.authority || '').trim()
    const status = String(body?.status || '').trim().toUpperCase()

    if (!authority) {
      throw createError({ statusCode: 400, statusMessage: 'authority الزامی است' })
    }

    await connectDB()
    const order = await Order.findOne({ authority })
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: 'سفارش پیدا نشد' })
    }

    if (order.status === 'paid' || order.status === 'shipped') {
      return { ok: true, alreadyPaid: true, orderId: order._id.toString() }
    }

    if (status !== 'OK') {
      if (order.status === 'pending') {
        order.status = 'failed'
        await order.save()
      }
      return { ok: false, status: order.status }
    }

    if (order.status !== 'pending' || order.paymentMethod !== 'online') {
      throw createError({ statusCode: 400, statusMessage: 'این سفارش قابل تأیید نیست' })
    }

    const verify = await $fetch<ZarinpalVerifyResponse>(
      'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
      {
        method: 'POST',
        body: {
          merchant_id: MERCHANT_ID,
          amount: order.amount * 10,
          authority,
        },
      }
    )

    const code = verify?.data?.code
    if (code !== 100 && code !== 101) {
      order.status = 'failed'
      await order.save()
      throw createError({ statusCode: 402, statusMessage: 'پرداخت تأیید نشد' })
    }

    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, status: 'pending' },
      { $set: { status: 'paid', stockDecremented: true } },
      { new: true }
    )

    if (!claimed) {
      return { ok: true, alreadyPaid: true, orderId: order._id.toString() }
    }

    try {
      await decrementStockForItems(claimed.items)
    } catch (err) {
      await Order.updateOne(
        { _id: claimed._id },
        { $set: { status: 'pending', stockDecremented: false } }
      )
      throw err
    }

    return {
      ok: true,
      orderId: claimed._id.toString(),
      amount: claimed.amount,
      refId: verify?.data?.ref_id,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'تأیید پرداخت ناموفق بود',
    })
  }
})
