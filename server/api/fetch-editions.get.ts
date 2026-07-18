// server/api/fetch-editions.get.ts
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const res = await $fetch(`https://openlibrary.org/works/${id}/editions.json?limit=5`)
  return res
})
