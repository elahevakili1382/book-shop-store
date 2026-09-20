import { defineEventHandler, createError, readBody, getRouterParam } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Invoice } from '../../models/Invoice'
import { requireAdmin } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)
    await connectDB()

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
    }

    const body = await readBody(event)

    const payload: Record<string, unknown> = {}
    if (body?.status) payload.status = body.status
    if (body?.customerName) payload.customerName = body.customerName
    if (body?.phone !== undefined) payload.phone = body.phone
    if (body?.amount != null) payload.amount = Number(body.amount)
    if (body?.note !== undefined) payload.note = body.note
    if (body?.dueAt) payload.dueAt = body.dueAt
    if (body?.number) payload.number = body.number

    const updated = await Invoice.findByIdAndUpdate(id, payload, { new: true }).lean()

    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
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
      statusMessage: 'Failed to update invoice',
    })
  }
})
