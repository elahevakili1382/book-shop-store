import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import {requireAuth} from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    requireAuth(event)

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()

    return users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      id: user._id.toString(),
    }))
  } catch (error) {
    console.log('GET /api/users failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users',
    })
  }
})
