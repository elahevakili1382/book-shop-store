import { defineEventHandler } from 'h3'
import { connectDB } from '../utils/mongodb'
import { User } from '../models/User'
import { getAuthOptional } from '../utils/requireAuth'

function publicUser(user: {
  _id: { toString: () => string }
  name: string
  email: string
  role?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
  }
}

export default defineEventHandler(async (event) => {
  const session = getAuthOptional(event)
  if (!session) {
    return { ok: false, user: null }
  }

  await connectDB()
  const user = await User.findById(session.id).select('name email role phone address city postalCode')
  if (!user) {
    return { ok: false, user: null }
  }

  return {
    ok: true,
    user: publicUser(user),
  }
})
