import { data } from 'autoprefixer'
import {books} from '../../data/book'

export default defineEventHandler((event) => {
    const query = getQuery(evet)

    const category = query.category as string | undefined
    const q = query.q as string | undefined

    let result = books

    if(category) {
        result = result.filter(b => b.category === category)
    }

    if(q) {
        result = result.filter(b =>
            b.title.toLowerCase().includes(q.toLowerCase())
        )
    }

    return{
        data:result,
        total: result.length
    }
})