export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing ID" })
  }

  return await $fetch(`https://69215dda512fb4140be003df.mockapi.io/invoices/${id}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" }
  })
})
