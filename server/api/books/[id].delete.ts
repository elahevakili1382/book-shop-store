import {defineEventHandler , createError,getRouterParam} from 'h3'
import {connectDB} from '../../utils/mongodb'
import {Book} from '../../models/Book'
import {requireAdmin} from '../../utils/requireAuth'

export default defineEventHandler(async(event) =>{

    try{
    await connectDB()
    requireAdmin(event)
    const id = getRouterParam(event, 'id')
    if(!id)throw createError({statusCode:400, statusMessage: 'Missing ID'})
    

    const deleted = await Book.findByIdAndDelete(id).lean()
    if (!deleted) {
  throw createError({ statusCode: 404, statusMessage: 'Book not found' })
}
  return{
     ok: true,
  id: deleted._id.toString(),

  }
    }catch(err:any){
        if(err?.statusCode) throw err
        throw createError({
            statusCode:500, 
            statusMessage: 'failed to delete book',})

    }

})