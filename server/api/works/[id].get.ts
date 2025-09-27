import type { WorkDetail } from '../../../types/types'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string

  try {
    const data = await $fetch<WorkDetail>(`https://openlibrary.org${id}.json`)
    return data
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'خطا در دریافت اطلاعات کتاب' })
  }
})
