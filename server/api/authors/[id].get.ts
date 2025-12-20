export default defineEventHandler(async (event) => {
const id = event.context.params?.id
if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing author id' })

try {
  const res = await $fetch("/api/openlibrary/subjects/programming.json?limit=20")
  return res
} catch (err) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch author', cause: err })
}

})
