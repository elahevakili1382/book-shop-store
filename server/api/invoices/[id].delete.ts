export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing ID" })
  }

  return await $fetch(`https://69215dda512fb4140be003df.mockapi.io/invoices/${id}`, {
    method: "DELETE",
  })
})
