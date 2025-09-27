export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string

  try {
    const data = await $fetch<{ name: string }>(`https://openlibrary.org${id}.json`)
    return data
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'خطا در دریافت نویسنده' })
  }
})
