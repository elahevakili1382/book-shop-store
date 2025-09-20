import { defineStore } from "pinia"
import type {
  SearchResponse,
  SubjectResponse,
  Doc,
  Work,
  Product as BaseProduct,
  WorkDetail,
  EditionEntry,
  EditionResponse,
} from "../../types/types"

export interface Product extends BaseProduct {
  id: string
  openLibraryId: string
}

export interface ProductDetail extends Product {
  author?: string
  summary?: string
  pages?: number
  format?: string
  language?: string
  publisher?: string
  publishDate?: string
  subjects?: string[]
  firstPublish?: string
}

export const useProductStore = defineStore("productStore", () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const categoryMap: Record<string, string> = {
    "برنامه‌نویسی و کامپیوتر": "programming",
    "تاریخ": "history",
    "بیوگرافی عمومی": "biography",
    "فانتزی": "fantasy",
    "علوم": "science",
    "هنر": "art",
    "ورزش و ورزشکاران": "sports",
    "کتاب کودک": "children",
    "رمان عاشقانه": "romance",
  }

  // 📌 گرفتن محصولات بر اساس دسته‌بندی
const fetchCategoryProducts = async (categoryKey: string) => {
  isLoading.value = true
  error.value = null
  const apiKey = categoryMap[categoryKey] || "biography"

  try {
    const data = await $fetch<SubjectResponse>(
      `https://openlibrary.org/subjects/${apiKey}.json?limit=20`
    )

    products.value = data.works
      .filter((book: Work) => book.cover_id)
      .map((book: Work, index: number) => ({
        id: (index + 1).toString(),
        openLibraryId: book.key,
        title: book.title,
        price: Math.floor(Math.random() * 200000) + 50000,
        image: book.cover_id
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
          : "/images/default-book.jpg",
        rating: book.rating ?? Math.round((Math.random() * 4 + 1) * 10) / 10,
        category: categoryKey,
        firstPublishYear: book.first_publish_year ?? 0, // 🔹 fallback برای جلوگیری از undefined
      }))

    return products.value
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : "خطای ناشناخته"
    return []
  } finally {
    isLoading.value = false
  }
}

  // 📌 جستجو
  const searchProducts = async (query: string) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<SearchResponse>(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      )

      products.value = data.docs
        .filter((book: Doc) => book.cover_i)
        .map((book: Doc, index: number) => ({
          id: (index + 1).toString(),
          openLibraryId: book.key,
          title: book.title,
          price: Math.floor(Math.random() * 200000) + 50000,
          image: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "/images/default-book.jpg",
          rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
          category: book.subject?.[0] || "نامشخص",
        }))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "خطای ناشناخته"
    } finally {
      isLoading.value = false
    }
  }



  
  // 📌 گرفتن جزئیات محصول
 const fetchProductById = async (id: string): Promise<ProductDetail | null> => {
  const product = products.value.find((p) => p.id === id)
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "محصول مورد نظر یافت نشد",
    })
  }

  try {
    // 📌 گرفتن اطلاعات کلی کتاب
    const workData = await $fetch<WorkDetail>(
      `https://openlibrary.org${product.openLibraryId}.json`
    )

  let authorName: string | undefined = undefined
if (workData.authors?.length && workData.authors[0]?.author?.key) {
  const authorRes = await $fetch<{ name: string }>(
    `https://openlibrary.org${workData.authors[0].author.key}.json`
  )
  authorName = authorRes.name
}


    // 📌 ژانرها
    const subjects: string[] = workData.subjects?.slice(0, 3) || []

    // 📌 اولین انتشار
    const firstPublish: string | undefined = workData.first_publish_date

    // 📌 گرفتن اطلاعات edition
    let editionData: EditionEntry | undefined
    try {
      const editions = await $fetch<EditionResponse>(
        `https://openlibrary.org/works/${workData.key}/editions.json?limit=5`
      )
      editionData =
        editions.entries.find(
          (e) =>
            e.number_of_pages ||
            e.physical_format ||
            e.languages ||
            e.publishers
        ) ?? editions.entries[0] ?? undefined
    } catch {
      editionData = undefined
    }

    // 📌 ساختن دیتای نهایی
    const detailedProduct: ProductDetail = {
      ...product,
      author: authorName,
      summary:
        typeof workData.description === "string"
          ? workData.description
          : workData.description?.value,
      subjects,
      firstPublish,
      pages: editionData?.number_of_pages,
      format: editionData?.physical_format,
      language: editionData?.languages?.[0]?.key
        ? editionData.languages[0]?.key.replace("/languages/", "")
        : undefined,
      publisher: editionData?.publishers?.[0],
      publishDate: editionData?.publish_date,
    }

    return detailedProduct
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      statusMessage: "خطا در دریافت اطلاعات محصول",
    })
  }
}


// 📌 گرفتن تازه‌های همه دسته‌ها
const fetchAllCategoriesProducts = async () => {
  isLoading.value = true
  error.value = null

  try {
    const allProducts: Product[] = []

    // برای هر دسته‌بندی یک fetch انجام بده
    for (const categoryKey of Object.keys(categoryMap)) {
      const apiKey = categoryMap[categoryKey]
      try {
        const data = await $fetch<SubjectResponse>(
          `https://openlibrary.org/subjects/${apiKey}.json?limit=10`
        )

        const categoryProducts: Product[] = data.works
          .filter((book: Work) => book.cover_id)
          .map((book: Work, index: number) => ({
            id: `${categoryKey}-${index + 1}`,
            openLibraryId: book.key,
            title: book.title,
            price: Math.floor(Math.random() * 200000) + 50000,
            image: book.cover_id
              ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
              : "/images/default-book.jpg",
            rating: book.rating ?? Math.round((Math.random() * 4 + 1) * 10) / 10,
            category: categoryKey,
            firstPublishYear: book.first_publish_year ?? 0,
          }))

        allProducts.push(...categoryProducts)
      } catch (err: unknown) {
        console.warn(`خطا در دریافت دسته ${categoryKey}`, err)
      }
    }

    products.value = allProducts
    return allProducts
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : "خطای ناشناخته"
    return []
  } finally {
    isLoading.value = false
  }
}

  return {
    products,
    isLoading,
    error,
    fetchCategoryProducts,
    searchProducts,
    fetchProductById,
    fetchAllCategoriesProducts,
  }
})
