import { defineEventHandler, createError, readBody } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { buildOrderFromItems } from '../../utils/orderPricing'
import { getAuthOptional } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    const body = await readBody(event)

    const customerName = String(body?.customerName || '').trim()
    const phone = String(body?.phone || '').trim()
    if (!customerName || !phone) {
      throw createError({ statusCode: 400, statusMessage: 'نام و موبایل الزامی است' })
    }

    const priced = await buildOrderFromItems(body?.items, body?.shippingMethod)
    const paymentMethod = body?.paymentMethod === 'cod' ? 'cod' : 'online'

    const session = getAuthOptional(event)

    const order = await Order.create({
      userId: session?.id || '',
      customerName,
      phone,
      address: String(body?.address || ''),
      city: String(body?.city || ''),
      postalCode: String(body?.postalCode || ''),
      amount: priced.amount,
      paymentMethod,
      shippingMethod: priced.shippingMethod,
      deliveryDay: String(body?.deliveryDay || ''),
      deliverySlot: String(body?.deliverySlot || ''),
      status: 'pending',
      items: priced.items,
      stockDecremented: false,
    })

    return {
      ok: true,
      order: {
        ...order.toObject(),
        _id: order._id.toString(),
        id: order._id.toString(),
        amount: priced.amount,
        items: priced.items,
      },
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'ثبت سفارش ناموفق بود',
    })
  }
})
