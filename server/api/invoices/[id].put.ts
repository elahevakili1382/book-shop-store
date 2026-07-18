import { defineEventHandler, createError } from 'h3'

type InvoiceResponse = {
  id: string
  name: string
  amount: number
  createdAt: string
  updatedAt: string
}
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  const body = await readBody(event)

  return await $fetch<Invoice>(
    `https://69215dda512fb4140be003df.mockapi.io/invoices/${id}`,
    {
      method: 'PUT',
      body,
      headers: { 'Content-Type': 'application/json' },
    }
  )
})