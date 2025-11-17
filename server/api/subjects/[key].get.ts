import type { SubjectResponse } from '../../../types/types'

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key as string
  const limit = (getQuery(event).limit as string) || '10'

  if (!key) {
    throw createError({
      statusCode: 400,
      message: 'Subject key is required'
    })
  }

  try {
    const url = `https://openlibrary.org/subjects/${key}.json?limit=${limit}`

    const data = await $fetch<SubjectResponse>(url)

    // اگر API خالی برگرداند → Crash نکن
    if (!data || !data.works) {
      return { works: [] }
    }

    return data
  } catch (err) {
    console.error('OpenLibrary Subject Error:', err)

    // هرگز صراحتاً 500 نده → خروجی خالی بده
    return { works: [] }
  }
})
