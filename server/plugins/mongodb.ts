import { connectDB } from '../utils/mongodb'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    console.log('MongoDB Connected ✅')
  } catch (error) {
    console.error('MongoDB plugin connection failed ❌', error)
  }
})
