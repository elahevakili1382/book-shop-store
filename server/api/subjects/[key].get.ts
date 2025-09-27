import type { SubjectResponse } from '../../../types/types'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<SubjectResponse> => {
  const key = event.context.params?.key as string
  const limit = (getQuery(event).limit as string) || '10'

  try {
    const data = await $fetch<SubjectResponse>(
      `https://openlibrary.org/subjects/${key}.json?limit=${limit}`
    )
    return data
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'خطا در دریافت دسته بندی' })
  }
})
