import { getCookie, createError } from 'h3'
import type { H3Event } from 'h3'
import jsonwebtoken from 'jsonwebtoken'

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
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

//یعنی توکن موجود را با SECRET چک می‌کنیم؛ اگر معتبر بود، همان اطلاعات داخلش را برمی‌گردانیم (decode)، توکن جدید نمی‌سازیم.

  try {
    const decoded = jwt.verify(token, SECRET) as AuthUser 
    return decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}
