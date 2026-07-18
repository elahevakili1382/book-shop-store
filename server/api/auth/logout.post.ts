import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
  })
  return { ok: true }
})
