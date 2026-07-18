import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'

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
      throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
    }

    await connectDB()

    const user = await User.findOne({ email }).select('name email role password')
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
    }

    const id = user._id.toString()

    const token = jwt.sign(
      { id, email: user.email, name: user.name, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    )

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60,
    })

    return {
      ok: true,
      user: {
        id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    console.error('POST /api/auth/login failed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Login failed',
    })
  }
})
