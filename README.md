# Book Shop Store

فروشگاه آنلاین کتاب با **Nuxt 4**، **TypeScript**، **TailwindCSS** و **MongoDB**.

شامل فروشگاه کاربر، سبد خرید، پرداخت، احراز هویت، و داشبورد ادمین  
(داشبورد در حال توسعه است و بخش‌های بیشتری به‌مرور اضافه می‌شود).

---

## دموی آنلاین

> در صورت نیاز از فیلترشکن استفاده کنید (به‌ویژه از داخل ایران).

- [صفحه اصلی](https://book-store-shop.vercel.app) — بعد از دیپلوی جدید لینک را به‌روز کنید
- [داشبورد ادمین](https://book-store-shop.vercel.app/dashboard) — در حال توسعه

کد منبع: [github.com/elahevakili1382/book-shop-store](https://github.com/elahevakili1382/book-shop-store)

---

## ویژگی‌ها

### فروشگاه
- لیست و دسته‌بندی کتاب‌ها
- صفحه جزئیات محصول و نظرات
- سبد خرید
- فلو آدرس ارسال و پرداخت (زرین‌پال — sandbox)
- طراحی ریسپانسیو

### بک‌اند و داده
- اتصال به **MongoDB** (مدل‌های Book، User، Order، Review، Category)
- APIهای Nitro (`/api/books`، `/api/users`، `/api/orders`، …)
- ثبت‌نام و ورود با JWT و هش رمز (bcrypt)

### داشبورد ادمین (در حال توسعه)
- کارت‌های آمار از داده واقعی (تعداد کتاب، کاربران، موجودی، سفارش امروز)
- لیست آخرین سفارش‌ها از MongoDB
- بخش‌های بیشتر (مدیریت کامل محصولات / سفارش‌ها و …) در دست کار

---

## تکنولوژی‌ها

- Nuxt / Vue 3
- TypeScript
- Pinia
- TailwindCSS
- MongoDB + Mongoose
- JWT + bcrypt

---

## راه‌اندازی محلی

### ۱) نصب وابستگی‌ها

```bash
npm install
```

### ۲) متغیرهای محیطی

فایل `.env` بساز (از روی `.env.example`):

```env
MONGODB_URL=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
```

### ۳) اجرا

```bash
npm run dev
```

اپ روی `http://localhost:3000` بالا می‌آید.

### اسکریپت‌های کمکی (اختیاری)

```bash
npm run seed-books
npm run seed-reviews
```

برای سفارش‌های نمونه در داشبورد (فقط dev):

```bash
# با سرور روشن
POST /api/dev/seed-orders
```

---

## ساختار کلی

```
app/          # صفحات، کامپوننت‌ها، استورها
server/       # APIها و مدل‌های Mongoose
types/        # تایپ‌های مشترک
public/       # تصاویر و فایل‌های استاتیک
```

---

## وضعیت توسعه

| بخش | وضعیت |
|-----|--------|
| فروشگاه و سبد | آماده |
| Auth + Mongo User | آماده |
| پرداخت (sandbox) | آماده |
| Order API + آخرین سفارش‌ها | آماده |
| داشبورد ادمین کامل | در حال توسعه |

---

## لایسنس

پروژه شخصی / نمونه کار.
