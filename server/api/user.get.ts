import { defineEventHandler, getCookie, createError } from 'h3'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev_secret'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    return { ok: false, user: null }
  }

  try {
    const decoded = jwt.verify(token, SECRET) as any
    // decoded شامل id,name,email
    return { ok: true, user: { id: decoded.id, name: decoded.name, email: decoded.email } }
  } catch (err) {
    return { ok: false, user: null }
  }
})
