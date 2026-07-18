import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = (body?.name || '').toString().trim()
  const email = (body?.email || '').toString().trim().toLowerCase()
  const password = (body?.password || '').toString()

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters' })
  }

  await connectDB()

  const existing = await User.findOne({ email }).lean()
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    email,
    password: hashed,
    role: 'user',
  })

  return {
    ok: true,
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  }
})
