import mongoose from 'mongoose'
import dns from 'node:dns'

// کمک به DNS در برخی شبکه‌ها — از querySrv پایدارتر
dns.setDefaultResultOrder('ipv4first')

declare global {
  // eslint-disable-next-line no-var
  var __mongoosePromise: Promise<typeof mongoose> | undefined
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (!globalThis.__mongoosePromise) {
    const { mongodbUri } = useRuntimeConfig()

    if (!mongodbUri) {
      throw new Error('Missing MONGODB_URI or MONGODB_URL in .env')
    }

    globalThis.__mongoosePromise = mongoose
      .connect(mongodbUri, {
        serverSelectionTimeoutMS: 20_000,
        connectTimeoutMS: 20_000,
        family: 4,
      })
      .then(() => mongoose)
      .catch((err) => {
        globalThis.__mongoosePromise = undefined
        throw err
      })
  }

  await globalThis.__mongoosePromise
  return mongoose
}
