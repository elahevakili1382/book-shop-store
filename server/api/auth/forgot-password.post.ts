import { createHash, randomBytes } from 'node:crypto'
import { defineEventHandler, readBody, getRequestURL } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { isIranMobile, toEnglishDigits } from '../../utils/phone'

function hashToken(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const phone = toEnglishDigits(String(body?.phone || body?.email || ''))

  const generic = {
    ok: true,
    message: 'اگر این شماره حساب داشته باشد، لینک بازیابی آماده می‌شود.',
  }

  if (!isIranMobile(phone)) {
    return generic
  }

  await connectDB()
  const user = await User.findOne({ phone })
  if (!user) {
    return generic
  }

  const raw = randomBytes(32).toString('hex')
  user.resetPasswordToken = hashToken(raw)
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000)
  await user.save()

  const origin = getRequestURL(event).origin
  const resetUrl = `${origin}/reset-password?token=${raw}`

  if (process.env.NODE_ENV === 'production') {
    return generic
  }

  return {
    ...generic,
    resetUrl,
  }
})
