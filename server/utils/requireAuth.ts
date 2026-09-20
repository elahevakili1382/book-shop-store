import { getCookie, createError } from 'h3'
import type { H3Event } from 'h3'
import jsonwebtoken from 'jsonwebtoken'
import { AUTH_COOKIE } from './authCookie'

const SECRET = process.env.JWT_SECRET || 'dev_secret'
const jwt: typeof jsonwebtoken =
  typeof (jsonwebtoken as any)?.sign === 'function'
    ? jsonwebtoken
    : ((jsonwebtoken as any).default as typeof jsonwebtoken)

export type AuthUser = {
  id: string
  email: string
  name: string
  role?: string
}

export function requireAuth(event: H3Event): AuthUser {
  const token = getCookie(event, AUTH_COOKIE)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, SECRET) as AuthUser
    return decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}

const ADMIN_ROLES = new Set(['admin', 'super-admin'])

export function requireAdmin(event: H3Event): AuthUser {
  const user = requireAuth(event)
  if (!user.role || !ADMIN_ROLES.has(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}
