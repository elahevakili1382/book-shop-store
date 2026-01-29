export default defineEventHandler(async () => {
  try{
    const data = await $fetch(
      'https://69215dda512fb4140be003df.mockapi.io/invoices'
    )
    return data
  } catch (error){
    console.error('Invoices API error:', error)
    throw createError({
      statusCode:500,
      statusMessage:'Failed to fetch invoices'
    })
  }
})
