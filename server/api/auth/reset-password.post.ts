import { createHash } from 'node:crypto'
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

function hashToken(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = String(body?.token || '').trim()
  const password = String(body?.password || '')

  if (!token || password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'لینک نامعتبر است یا رمز باید حداقل ۶ کاراکتر باشد',
    })
  }

  await connectDB()
  const user = await User.findOne({
    resetPasswordToken: hashToken(token),
    resetPasswordExpires: { $gt: new Date() },
  }).select('name email role password resetPasswordToken resetPasswordExpires')

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'این لینک منقضی یا نامعتبر است. دوباره درخواست بده.',
    })
  }

  user.password = await bcrypt.hash(password, 10)
  user.resetPasswordToken = ''
  user.resetPasswordExpires = undefined
  await user.save()

  const id = user._id.toString()
  const jwtToken = jwt.sign(
    { id, email: user.email, name: user.name, role: user.role },
    SECRET,
    { expiresIn: '7d' },
  )
  setAuthCookie(event, jwtToken)

  return {
    ok: true,
    user: {
      id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }
})
