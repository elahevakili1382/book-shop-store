/**
 * منبع اصلی دادهٔ نظرات — فقط این فایل را ویرایش کن.
 * بعد در ترمینال: npm run seed-reviews
 *
 * bookSlug = همان slug در URL مثل /product/clean-code
 */
export interface ReviewSeedEntry {
  bookSlug: string
  authorName: string
  rating: number
  comment: string
  /** days ago from now */
  daysAgo?: number
}

export const REVIEWS_SEED: ReviewSeedEntry[] = [
  {
    bookSlug: 'clean-code',
    authorName: 'امیر حسینی',
    rating: 5,
    comment: 'برای هر برنامه‌نویسی که می‌خواهد حرفه‌ای شود ضروری است. مثال‌ها عملی و قابل اجرا هستند.',
    daysAgo: 12,
  },
  {
    bookSlug: 'clean-code',
    authorName: 'نگین کریمی',
    rating: 5,
    comment: 'ترجمه روان و چاپ با کیفیت. بعد از خواندنش سبک کدنویسی‌ام واقعاً عوض شد.',
    daysAgo: 34,
  },
  {
    bookSlug: 'clean-code',
    authorName: 'پویا مرادی',
    rating: 4,
    comment: 'کتاب عالی است ولی برای مبتدی absolute شاید سنگین باشد.',
    daysAgo: 58,
  },
  {
    bookSlug: 'atomic-habits',
    authorName: 'سارا محمدی',
    rating: 5,
    comment: 'بهترین کتاب عادت‌سازی که خوانده‌ام. ساده، علمی و قابل اجرا در زندگی روزمره.',
    daysAgo: 7,
  },
  {
    bookSlug: 'atomic-habits',
    authorName: 'رضا نوروزی',
    rating: 5,
    comment: 'بعد از یک ماه اجرای تکنیک‌های کتاب، واقعاً تغییر محسوس دیدم.',
    daysAgo: 21,
  },
  {
    bookSlug: 'atomic-habits',
    authorName: 'مریم اکبری',
    rating: 4,
    comment: 'محتوا عالی؛ فقط دوست داشتم مثال‌های بیشتری از فرهنگ ایرانی داشت.',
    daysAgo: 45,
  },
  {
    bookSlug: 'sapiens',
    authorName: 'کیوان فدایی',
    rating: 5,
    comment: 'نگاهی تازه به تاریخ بشریت. برای علاقه‌مندان تاریخ و علوم اجتماعی فوق‌العاده است.',
    daysAgo: 15,
  },
  {
    bookSlug: 'sapiens',
    authorName: 'الهام رستمی',
    rating: 4,
    comment: 'جذاب و پرمحتوا. بعضی بخش‌ها نیاز به تمرکز بیشتر دارد.',
    daysAgo: 40,
  },
  {
    bookSlug: '1984',
    authorName: 'حامد جلیلی',
    rating: 5,
    comment: 'کلاسیک ماندگار. ترجمه خوب و جلد تمیز. هر بار خواندنش لایه تازه‌ای دارد.',
    daysAgo: 9,
  },
  {
    bookSlug: '1984',
    authorName: 'نازنین احمدی',
    rating: 5,
    comment: 'برای دوستدار رمان سیاسی-اجتماعی بی‌نظیر. ارسال سریع بود.',
    daysAgo: 28,
  },
  {
    bookSlug: 'harry-potter-and-the-sorcerers-stone',
    authorName: 'پریسا کاظمی',
    rating: 5,
    comment: 'ترجمه ویدا اسلامیه عالی است. فرزندم عاشقش شد و خودم هم لذت بردم!',
    daysAgo: 5,
  },
  {
    bookSlug: 'harry-potter-and-the-sorcerers-stone',
    authorName: 'مهدی صادقی',
    rating: 5,
    comment: 'کتاب سالم و با چاپ خوب. بسته‌بندی محکم رسید.',
    daysAgo: 18,
  },
  {
    bookSlug: 'javascript-the-good-parts',
    authorName: 'آرش باقری',
    rating: 4,
    comment: 'کوتاه ولی پرچرب. برای کسانی که JS می‌دانند بسیار مفید است.',
    daysAgo: 22,
  },
  {
    bookSlug: 'the-pragmatic-programmer',
    authorName: 'سینا توکلی',
    rating: 5,
    comment: 'هر فصل یک درس عملی برای کار تیمی و کیفیت کد. ارزش خرید دارد.',
    daysAgo: 11,
  },
  {
    bookSlug: 'deep-work',
    authorName: 'نیما رضایی',
    rating: 4,
    comment: 'در دوره شلوغی امروز، راهکارهای تمرکز کتاب واقعاً کاربردی بود.',
    daysAgo: 30,
  },
  {
    bookSlug: 'the-kite-runner',
    authorName: 'فاطمه یوسفی',
    rating: 5,
    comment: 'داستانی احساسی و عمیق. ترجمه روان و خواندن راحت.',
    daysAgo: 14,
  },
  {
    bookSlug: 'a-brief-history-of-time',
    authorName: 'مجتبی واحدی',
    rating: 4,
    comment: 'برای ورود به فیزیک نظری عالی. بعضی بخش‌ها نیاز به مطالعه دوباره دارد.',
    daysAgo: 26,
  },
  {
    bookSlug: 'design-patterns',
    authorName: 'کامران شریفی',
    rating: 4,
    comment: 'مرجع کلاسیک OOP. برای مصاحبه و معماری نرم‌افزار عالی است.',
    daysAgo: 19,
  },
]
