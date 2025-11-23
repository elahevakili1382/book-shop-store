// import { useProductStore } from "@/stores/productStore"

// export default defineEventHandler(async (event) => {
//   const query = getQuery(event)
//   const slug = query.slug as string

//   if (!slug) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: "Slug is required"
//     })
//   }

//   // استور را صدا می‌زنیم (به صورت سروری)
//   const productStore = useProductStore()

//   // چون slug همان openLibraryId است
//   const product = await productStore.fetchProductById(slug)

//   if (!product) {
//     throw createError({
//       statusCode: 404,
//       statusMessage: "Product not found"
//     })
//   }

//   return product
// })
