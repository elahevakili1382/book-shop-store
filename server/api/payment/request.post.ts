import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'

const MERCHANT_ID = '00000000-0000-0000-0000-000000000000'

type ZarinpalRequestResponse = {
  data?: {
    authority?: string
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const orderId = String(body?.orderId || '').trim()
    const callbackUrl = String(body?.callbackUrl || '').trim()

    if (!orderId) {
      throw createError({ statusCode: 400, statusMessage: 'شناسه سفارش الزامی است' })
    }
    if (!callbackUrl) {
      throw createError({ statusCode: 400, statusMessage: 'callbackUrl الزامی است' })
    }

    await connectDB()
    const order = await Order.findById(orderId)
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: 'سفارش پیدا نشد' })
    }
    if (order.status !== 'pending' || order.paymentMethod !== 'online') {
      throw createError({ statusCode: 400, statusMessage: 'این سفارش قابل پرداخت نیست' })
    }
    if (!order.amount || order.amount <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'مبلغ نامعتبر است' })
    }

    const amountRial = order.amount * 10
    const response = await $fetch<ZarinpalRequestResponse>(
      'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
      {
        method: 'POST',
        body: {
          merchant_id: MERCHANT_ID,
          amount: amountRial,
          callback_url: callbackUrl,
          description: 'پرداخت سفارش کتاب',
        },
      }
    )

    const authority = response?.data?.authority
    if (!authority) {
      throw createError({
        statusCode: 502,
        statusMessage: 'authority دریافت نشد',
      })
    }

    order.authority = authority
    await order.save()

    return {
      ok: true,
      authority,
      amount: order.amount,
      paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'خطا در اتصال به درگاه',
    })
  }
})
