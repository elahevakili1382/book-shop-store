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

  return await $fetch<InvoiceResponse>(
    `https://69215dda512fb4140be003df.mockapi.io/invoices/${id}`,
    {
      method: 'DELETE',
    }
  )
})
