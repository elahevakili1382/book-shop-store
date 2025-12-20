import { ofetch } from 'ofetch'

export default defineEventHandler(async () => {
  return await ofetch("https://69215dda512fb4140be003df.mockapi.io/invoices")
})
