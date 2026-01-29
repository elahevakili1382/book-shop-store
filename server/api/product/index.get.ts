import { defineEventHandler, getQuery, createError } from 'h3'

// کش ساده در حافظه (برای نمونه)
const cache: Record<string, any> = {}

async function fetchWithRetry(url: string, retries = 2, timeout = 30000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await $fetch(url, { timeout })
    } catch (err) {
      if (i === retries) throw err
    }
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const subject = (query.subject as string) || 'programming'
  const limit = Number(query.limit) || 10
  const cacheKey = `${subject}-${limit}`

  // اگر داده تو کش هست، همون رو برگردون
  if (cache[cacheKey]) return cache[cacheKey]

  const url = `https://openlibrary.org/subjects/${subject}.json?limit=${limit}`

  try {
    const data = await fetchWithRetry(url, 2, 60000) // retry 2 بار، timeout 60s
    cache[cacheKey] = data // ذخیره در کش
    return data
  } catch (err: any) {
    console.error('OpenLibrary Proxy Error:', err.message)

    // اگر قبلا داده کش داریم، برگردون
    if (cache[cacheKey]) return cache[cacheKey]

    // اگر نه، خطای مناسب برگردون
    throw createError({
      statusCode: 502,
      statusMessage: 'OpenLibrary Request Failed',
    })
  }
})
