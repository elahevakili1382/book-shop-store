import type { EditionResponse } from '../../../../types/types'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const limit = (getQuery(event).limit as string) || '5'

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Work ID is required'
    })
  }

  try {
    const url = `https://openlibrary.org/works/${id}/editions.json?limit=${limit}`
    const data = await $fetch<EditionResponse>(url)

    // داده نداشت → خروجی خالی
    if (!data || !data.entries) {
      return { entries: [] }
    }

    return data
  } catch (err) {
    console.error('OpenLibrary Editions Error:', err)

    // هرگز 500 واقعی نده → فقط خروجی خالی
    return { entries: [] }
  }
})
