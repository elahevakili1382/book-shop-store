import { connectDB } from "../../utils/mongodb"
import { Category } from "../../models/Category"
import {Book} from "../../models/Book"

export default defineEventHandler(async() => {
    await connectDB()

    const categories = await Category.find().lean()

    const result = await Promise.all(
        categories.map(async (cat) =>{
            const items = await Book.countDocuments({category:cat.slug})

            return {
                id: cat.slug,
                slug: cat.slug,
                name: cat.name,
                icon: cat.icon,
                items,
            }
        })
    )

    return result
})