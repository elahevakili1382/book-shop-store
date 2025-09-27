import type { EditionResponse } from '../../../../types/types'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const limit = getQuery(event).limit || '5'

  try {
    const data = await $fetch<EditionResponse>(
      `https://openlibrary.org/works/${id}/editions.json?limit=${limit}`
    )
    return data
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'خطا در دریافت editions' })
  }
})
