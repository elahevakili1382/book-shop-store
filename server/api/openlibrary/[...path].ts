import type { EventHandler } from 'h3'
import { getQuery, createError } from 'h3'

const cache: Record<string, unknown> = {}

async function fetchWithRetry(url: string, retries = 2, timeout = 60000): Promise<unknown> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await $fetch<unknown>(url, { timeout })
    } catch (err) {
      if (i === retries) throw err
    }
  }
  throw new Error('fetchWithRetry failed')
}

const handler: EventHandler<any> = async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = (query.q as string) || ''
    const limit = Number(query.limit) || 10

    const targetURL = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      searchTerm
    )}&limit=${limit}`

    const cacheKey = targetURL
    if (cache[cacheKey]) return cache[cacheKey]

    const data: unknown = await fetchWithRetry(targetURL)
    cache[cacheKey] = data
    return data
  } catch (err: any) {
    console.error('OpenLibrary Proxy Error:', err.message)
    throw createError({
      statusCode: 502,
      statusMessage: 'OpenLibrary Request Failed',
    })
  }
}

export default handler
