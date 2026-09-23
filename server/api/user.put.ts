import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../utils/mongodb'
import { User } from '../models/User'
import { requireAuth } from '../utils/requireAuth'

export default defineEventHandler(async (event) => {
  const session = requireAuth(event)
  const body = await readBody(event)

  const name = String(body?.name || '').trim()
  const phone = String(body?.phone || '').trim()
  const address = String(body?.address || '').trim()
  const city = String(body?.city || '').trim()
  const postalCode = String(body?.postalCode || '').trim()

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'نام الزامی است' })
  }

  await connectDB()
    const user = await User.findByIdAndUpdate(
    session.id,
    { $set: { name, phone, address, city, postalCode } },
    { new: true, runValidators: true },
  ).select('name email role phone address city postalCode walletBalance')

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'کاربر پیدا نشد' })
  }

  return {
    ok: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      walletBalance: user.walletBalance ?? 0,
    },
  }
})
