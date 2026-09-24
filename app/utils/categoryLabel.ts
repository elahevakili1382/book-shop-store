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

const SEARCH: Record<string, string> = {
  programming: 'برنامه‌نویسی کامپیوتر',
  psychology: 'روانشناسی رشد فردی',
  literature: 'ادبیات رمان داستان',
  fiction: 'رمان داستان',
  'self-help': 'رشد فردی',
  history: 'تاریخ',
  children: 'کودک کتاب کودک',
  science: 'علوم',
  romance: 'رمان عاشقانه',
  biography: 'بیوگرافی',
  fantasy: 'فانتزی',
  art: 'هنر',
  sports: 'ورزش',
}

export function categoryLabel(slug?: string) {
  const key = String(slug || '').trim()
  if (!key) return 'سایر'
  return LABELS[key] || key
}

export function categorySearchText(slug?: string) {
  const key = String(slug || '').trim()
  return [categoryLabel(key), SEARCH[key] || ''].filter(Boolean).join(' ')
}
