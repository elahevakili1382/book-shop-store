import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { isIranMobile, phoneToPlaceholderEmail, toEnglishDigits } from '../../utils/phone'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = (body?.name || '').toString().trim()
  const phone = toEnglishDigits(String(body?.phone || ''))
  const password = (body?.password || '').toString()

  if (!name || !phone || !password) {
    throw createError({ statusCode: 400, statusMessage: 'نام، موبایل و رمز الزامی است' })
  }

  if (!isIranMobile(phone)) {
    throw createError({ statusCode: 400, statusMessage: 'موبایل را با ۰۹ و ۱۱ رقم وارد کن' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'رمز باید حداقل ۶ کاراکتر باشد' })
  }

  await connectDB()

  const existing = await User.findOne({ phone }).lean()
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'این شماره قبلاً ثبت شده' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    phone,
    email: phoneToPlaceholderEmail(phone),
    password: hashed,
    role: 'user',
  })

  return {
    ok: true,
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  }
})
