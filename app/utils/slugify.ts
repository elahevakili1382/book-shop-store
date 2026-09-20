export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productPath(product: {
  slug?: string
  title?: string
  titleEn?: string
  id?: string | number
  _id?: string
}): string {
  const slug =
    product.slug?.trim() ||
    slugify(product.titleEn || '') ||
    slugify(product.title || '')
  if (slug) return `/product/${encodeURIComponent(slug)}`
  const id = product.id ?? product._id
  if (id) return `/product/${id}`
  return '/new'
}
