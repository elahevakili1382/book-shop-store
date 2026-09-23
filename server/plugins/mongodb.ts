import { connectDB } from '../utils/mongodb'
import { ensureBookCatalog } from '../utils/ensureBookCatalog'
import { ensureDevAdmin } from '../utils/ensureDevAdmin'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    await ensureDevAdmin()
    console.log('MongoDB Connected ✅')
    void ensureBookCatalog().catch((error) => {
      console.error('Background catalog sync failed', error)
    })
  } catch (error) {
    console.error('MongoDB plugin connection failed ❌', error)
  }
})
