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
  walletBalance?: number
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
    walletBalance: user.walletBalance ?? 0,
  }
}

export default defineEventHandler(async (event) => {
  const session = getAuthOptional(event)
  if (!session) {
    return { ok: false, user: null }
  }

  await connectDB()
  const user = await User.findById(session.id).select('name email role phone address city postalCode walletBalance')
  if (!user) {
    return { ok: false, user: null }
  }

  return {
    ok: true,
    user: publicUser(user),
  }
})
