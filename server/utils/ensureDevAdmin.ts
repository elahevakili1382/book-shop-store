import bcrypt from 'bcryptjs'
import { User } from '../models/User'

const DEFAULT_EMAIL = 'admin@booklett.ir'
const DEFAULT_PASSWORD = 'BooklettAdmin123'

export async function ensureDevAdmin() {
  if (process.env.NODE_ENV === 'production') return

  const email = (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD

  const existing = await User.findOne({ email })
  if (existing) {
    existing.role = 'admin'
    existing.password = await bcrypt.hash(password, 10)
    await existing.save()
    return
  }

  const hashed = await bcrypt.hash(password, 10)
  await User.create({
    name: 'مدیر Booklett',
    email,
    password: hashed,
    role: 'admin',
  })

  console.log(`Dev admin ready → ${email}`)
}
