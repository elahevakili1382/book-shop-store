import {defineEventHandler ,readBody, createError,getRouterParam} from 'h3'
import {connectDB} from '../../utils/mongodb'
import {Book} from '../../models/Book'
import {requireAdmin} from '../../utils/requireAuth'

export default defineEventHandler(async(event) =>{

    try{
    await connectDB()
    requireAdmin(event)
    const id = getRouterParam(event, 'id')
    if(!id)throw createError({statusCode:400, statusMessage: 'Missing ID'})
    const body = await readBody(event)
    const payload:Record<string,unknown> = {}
    if(body?.title != null) payload.title = body.title
    if(body?.price != null) payload.price = Number(body.price)
    if(body?.category != null) payload.category = body.category
    if(body?.stock != null || body?.quantity != null){
        payload.stock = Number(body.stock ?? body?.quantity)
    }
    if (body?.description != null) payload.description = body.description
    if (body?.image != null) payload.image = body.image
    if (body?.slug != null) payload.slug = body.slug
    if (body?.titleEn != null) payload.titleEn = body.titleEn
    if (body?.isbn != null) payload.isbn = body.isbn 

    if (Object.keys(payload).length === 0) {
  throw createError({ statusCode: 400, statusMessage: 'Nothing to update' })
}

    const updated = await Book.findByIdAndUpdate(id, payload,{new:true}).lean()
    if (!updated) {
  throw createError({ statusCode: 404, statusMessage: 'Book not found' })
}
  return{
    ...updated,
    _id:updated._id.toString(),
    id:updated._id.toString(),
    quantity: updated.stock,

  }
    }catch(err:any){
        if(err?.statusCode) throw err
        throw createError({
            statusCode:500, 
            statusMessage: 'failed to update book',})

    }

})