import { defineEventHandler, createError, readBody, getRouterParam } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { requireAdmin } from '../../utils/requireAuth'
import { decrementStockForItems } from '../../utils/stock'

const FULFILLED = new Set(['paid', 'shipped'])

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    requireAdmin(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const status = body?.status

    if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing ID' })

    const allowed = ['pending', 'paid', 'failed', 'shipped']
    if (!allowed.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid status',
      })
    }

    const existing = await Order.findById(id)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Order not found' })
    }

    const shouldDecrement =
      FULFILLED.has(status) && !existing.stockDecremented

    if (shouldDecrement) {
      await decrementStockForItems(existing.items)
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      {
        status,
        ...(shouldDecrement ? { stockDecremented: true } : {}),
      },
      { new: true }
    ).lean()

    if (!updated) {
      throw createError({ statusCode: 404 })
    }

    return {
      ...updated,
      _id: updated._id.toString(),
      id: updated._id.toString(),
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'failed to update order',
    })
  }
})
