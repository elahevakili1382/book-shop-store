import { connectDB } from '../utils/mongodb'
import { ensureBookCatalog } from '../utils/ensureBookCatalog'
import { ensureDevAdmin } from '../utils/ensureDevAdmin'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    await ensureBookCatalog()
    await ensureDevAdmin()
    console.log('MongoDB Connected ✅')
  } catch (error) {
    console.error('MongoDB plugin connection failed ❌', error)
  }
})
