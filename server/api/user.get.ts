import { defineEventHandler, getCookie } from 'h3'
import jwt from 'jsonwebtoken'
import { AUTH_COOKIE } from '../utils/authCookie'

const SECRET = process.env.JWT_SECRET || 'dev_secret'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, AUTH_COOKIE)
  if (!token) {
    return { ok: false, user: null }
  }

  try {
    const decoded = jwt.verify(token, SECRET) as any
    // decoded شامل id,name,email
    return {
      ok: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role as string | undefined,
      },
    }
  } catch (err) {
    return { ok: false, user: null }
  }
})
