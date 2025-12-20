// server/api/search.get.ts
import type { SearchResponse } from '../../types/types'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event)=> {
  const query = (getQuery(event).q as string) || ''

  if(!query){
   return {
    docs:[],
    numFound:0,
    error: null,
   }
  }


  try {
    const data = await $fetch<SearchResponse>(
      'https://openlibrary.org/search.json',
      {
        params:{q:query},
        timeout:8000,
      }
    )
    return data
  } catch (error:any) {
    console.warn('OpenLibrary unavailable')

  return{
    docs:[],
    numFound:0,
    error:'SERVICE_UNAVAILABLE',
  }
  }
})
