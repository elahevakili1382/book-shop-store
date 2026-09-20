import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Invoice } from '../../models/Invoice'
import { requireAdmin } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {

  try{
    requireAdmin(event)
    await connectDB()
      const id = event.context.params?.id

      if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  const deleted = await Invoice.findByIdAndDelete(id)

  if(!deleted) {
    throw createError({statusCode:404, statusMessage:'Invoice not found'})
  }
  return{ok:true, id}

  } catch(err:any){
    if(err?.statusCode) throw err
    throw createError({
      statusCode:500,
      statusMessage: 'Failed to delete invoice'
    })
  }

  

  
})
