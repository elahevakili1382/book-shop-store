import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { readUsers } from '../../utils/users'

const SECRET = process.env.JWT_SECRET || 'dev_secret'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = body?.email?.trim().toLowerCase()
  const password = body?.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const users = await readUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET,
    { expiresIn: '1h' }
  )

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  })

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
    token,
  }
})
