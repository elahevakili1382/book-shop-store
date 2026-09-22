import {defineEventHandler ,readBody, createError } from 'h3'
import {connectDB} from '../../utils/mongodb'
import {Book} from '../../models/Book'
import {requireAdmin} from '../../utils/requireAuth'
import { slugify } from '../../utils/slugify'

export default defineEventHandler(async(event) =>{

    try{
    await connectDB()
    requireAdmin(event)
    const body = await readBody(event)
    const title = body?.title
    const titleEn = typeof body?.titleEn === 'string' ? body.titleEn : undefined
    const price = Number(body?.price)
    const category = body?.category || 'عمومی'
    const stock = Number(body?.stock ?? body?.quantity?? 0)
    const description = body?.description ?? ''
    const image = body?.image ?? '/images/NonFictionIcon(1).svg'
    const isbn = typeof body?.isbn === 'string' ? body.isbn : undefined
    const author = typeof body?.author === 'string' ? body.author.trim() : undefined
    const publisher = typeof body?.publisher === 'string' ? body.publisher.trim() : undefined
    const pages = body?.pages != null && body.pages !== '' ? Number(body.pages) : undefined
    const features = Array.isArray(body?.features)
      ? body.features.map((item: unknown) => String(item).trim()).filter(Boolean)
      : []
    const slug =
      (typeof body?.slug === 'string' && body.slug.trim()) ||
      slugify(titleEn || '') ||
      slugify(title || '')

    if(!title || Number.isNaN(price) || price < 0) 
        {throw createError({statusCode:400, statusMessage: 'Invalid book data'})}

  const created = await Book.create({
    title,
    titleEn,
    price,
    category,
    stock,
    description,
    image,
    isbn,
    author,
    publisher,
    pages: Number.isFinite(pages) ? pages : undefined,
    features,
    slug: slug || undefined,
  })

  if (!created.slug) {
    created.slug = created._id.toString()
    await created.save()
  }

  return{
    ...created.toObject(),
    _id:created._id.toString(),
    id:created._id.toString(),
    slug: created.slug,
    quantity: created.stock,
  }

    }catch(err:any){
        if(err?.statusCode) throw err
        throw createError({
            statusCode:500, 
            statusMessage: 'failed to create book',})

    }

})