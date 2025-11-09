import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import { readUsers, writeUsers } from '../../utils/users'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = (body?.name || '').toString().trim()
  const email = (body?.email || '').toString().trim().toLowerCase()
  const password = (body?.password || '').toString()

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  const users = await readUsers()

  // چک ایمیل تکراری
  if (users.find(u => u.email === email)) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  // هش پسورد
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)

  const newUser = {
    id: randomUUID(),
    name,
    email,
    password: hashed,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await writeUsers(users)

  // برگردوندن کاربر بدون پسورد
  const { password: _p, ...safe } = newUser
  return { ok: true, user: safe }
})
