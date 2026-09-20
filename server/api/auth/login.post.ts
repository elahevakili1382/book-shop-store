import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { setAuthCookie } from '../../utils/authCookie'

const SECRET = process.env.JWT_SECRET || 'dev_secret'
const jwt: typeof jsonwebtoken =
  typeof (jsonwebtoken as any)?.sign === 'function'
    ? jsonwebtoken
    : ((jsonwebtoken as any).default as typeof jsonwebtoken)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const email = (body?.email || '').toString().trim().toLowerCase()
    const password = (body?.password || '').toString()

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'ایمیل و رمز را کامل کن' })
    }

    await connectDB()

    const user = await User.findOne({ email }).select('name email role password')
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'ایمیلی با این مشخصات پیدا نشد' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      throw createError({ statusCode: 401, statusMessage: 'رمز عبور اشتباه است' })
    }

    const id = user._id.toString()

    const token = jwt.sign(
      { id, email: user.email, name: user.name, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    )

    setAuthCookie(event, token)

    return {
      ok: true,
      user: {
        id,
        email: user.email,
        name: user.name,
        role: user.role,
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
