export function toEnglishDigits(value: string) {
  return String(value || '')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[\s-]/g, '')
}

export function isIranMobile(value: string) {
  return /^09\d{9}$/.test(toEnglishDigits(value))
}

export function normalizeLoginId(value: string) {
  const raw = String(value || '').trim()
  if (raw.includes('@')) return raw.toLowerCase()
  return toEnglishDigits(raw)
}

export function phoneToPlaceholderEmail(phone: string) {
  return `${toEnglishDigits(phone)}@phone.booklett.local`
}

export function isPlaceholderEmail(email?: string) {
  return Boolean(email?.endsWith('@phone.booklett.local'))
}
