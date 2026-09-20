import { setCookie } from 'h3'
import type { H3Event } from 'h3'

export const AUTH_COOKIE = 'auth_token'
const MAX_AGE = 60 * 60 * 24 * 7

function cookieBase() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  }
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, AUTH_COOKIE, token, {
    ...cookieBase(),
    maxAge: MAX_AGE,
  })
}

export function clearAuthCookie(event: H3Event) {
  setCookie(event, AUTH_COOKIE, '', {
    ...cookieBase(),
    maxAge: 0,
  })
}
