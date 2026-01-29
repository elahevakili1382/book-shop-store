import type { EventHandler } from 'h3'

const handler: EventHandler<any> = async (event) => {
  const { id } = event.context.params as { id?: string }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product id is required',
    })
  }

  return await $fetch<unknown>(
    `https://openlibrary.org/works/${id}.json`,
    { timeout: 15000 }
  )
}

export default handler
