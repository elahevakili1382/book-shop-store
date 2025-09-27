// server/api/search.get.ts
import type { SearchResponse } from '../../types/types'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<SearchResponse> => {
  const query = (getQuery(event).q as string) || ''
  try {
    const data = await $fetch<SearchResponse>(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    )
    return data
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'خطا در جستجو' })
  }
})
