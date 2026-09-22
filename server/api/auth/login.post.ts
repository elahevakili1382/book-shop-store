import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { setAuthCookie } from '../../utils/authCookie'
import { isIranMobile, normalizeLoginId } from '../../utils/phone'

const SECRET = process.env.JWT_SECRET || 'dev_secret'
const jwt: typeof jsonwebtoken =
  typeof (jsonwebtoken as any)?.sign === 'function'
    ? jsonwebtoken
    : ((jsonwebtoken as any).default as typeof jsonwebtoken)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const identifier = normalizeLoginId(String(body?.phone || body?.email || ''))
    const password = (body?.password || '').toString()

    if (!identifier || !password) {
      throw createError({ statusCode: 400, statusMessage: 'موبایل و رمز را کامل کن' })
    }

    await connectDB()

    const user = identifier.includes('@')
      ? await User.findOne({ email: identifier }).select('name email role password phone')
      : isIranMobile(identifier)
        ? await User.findOne({ phone: identifier }).select('name email role password phone')
        : null

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'حسابی با این مشخصات پیدا نشد' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      throw createError({ statusCode: 401, statusMessage: 'رمز عبور اشتباه است' })
    }

    const id = user._id.toString()

    const token = jwt.sign(
      { id, email: user.email, name: user.name, role: user.role },
      SECRET,
      { expiresIn: '7d' },
    )

    setAuthCookie(event, token)

    return {
      ok: true,
      user: {
        id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone || '',
      },
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    console.error('POST /api/auth/login failed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'ورود ناموفق بود',
    })
  }
})
