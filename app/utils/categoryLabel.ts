const LABELS: Record<string, string> = {
  programming: 'برنامه‌نویسی',
  psychology: 'روانشناسی',
  literature: 'ادبیات',
  history: 'تاریخ',
  children: 'کودک',
  science: 'علوم',
  biography: 'بیوگرافی',
  fantasy: 'فانتزی',
  art: 'هنر',
  sports: 'ورزش',
  romance: 'رمان',
  سایر: 'سایر',
}

export const CATEGORY_SLUGS = Object.keys(LABELS).filter((key) => key !== 'سایر')

export function categoryLabel(slug?: string) {
  const key = String(slug || '').trim()
  if (!key) return 'سایر'
  return LABELS[key] || key
}
