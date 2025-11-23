import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // نوع‌دهی params به صورت non-nullable
  const params = event.context.params as { id: string }
  const { id } = params

  try {
    const res = await fetch(`https://openlibrary.org/works/${id}.json`)
    if (!res.ok) throw new Error('OpenLibrary API error')
    const data = await res.json()
    return data
  } catch (err) {
    event.node.res.statusCode = 500
    return { error: (err as Error).message }
  }
})
