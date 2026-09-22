import { randomBytes } from 'node:crypto'
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { requireAdmin } from '../../utils/requireAuth'
import { isIranMobile, phoneToPlaceholderEmail, toEnglishDigits } from '../../utils/phone'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  const firstName = String(body?.firstName || '').trim()
  const lastName = String(body?.lastName || '').trim()
  const name = `${firstName} ${lastName}`.trim() || String(body?.name || '').trim()
  const phone = toEnglishDigits(String(body?.phone || ''))
  const city = String(body?.city || '').trim()
  const province = String(body?.province || '').trim()
  const address = String(body?.address || '').trim()

  if (!name || !phone) {
    throw createError({ statusCode: 400, statusMessage: 'نام و موبایل الزامی است' })
  }
  if (!isIranMobile(phone)) {
    throw createError({ statusCode: 400, statusMessage: 'موبایل را با ۰۹ و ۱۱ رقم وارد کن' })
  }

  await connectDB()

  const existing = await User.findOne({ phone }).lean()
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'این شماره قبلاً ثبت شده' })
  }

  const hashed = await bcrypt.hash(`Booklett-${randomBytes(8).toString('hex')}`, 10)

  const created = await User.create({
    name,
    phone,
    email: phoneToPlaceholderEmail(phone),
    password: hashed,
    role: 'user',
    city,
    province,
    address,
  })

  return {
    ok: true,
    user: {
      id: created._id.toString(),
      _id: created._id.toString(),
      name: created.name,
      phone: created.phone,
      email: created.email,
      city: created.city || '',
      province: created.province || '',
      address: created.address || '',
      role: created.role,
      createdAt: new Date().toISOString(),
    },
  }
})
