<template>
  <main class="min-h-screen">
    <div class="mx-auto max-w-[800px] px-4 py-12 sm:px-8 sm:py-16">
      <p class="text-xs font-bold text-slate/45">درباره Booklett</p>
      <h1 class="mt-2 text-3xl font-black text-slate sm:text-4xl">کتاب اصل، مسیر کوتاه تا در خانه</h1>
      <p class="mt-4 max-w-2xl text-sm leading-relaxed text-slate/60 sm:text-base">
        Booklett فروشگاه آنلاین کتاب چاپی است. جلد واقعی می‌بینی، قیمت همان روی جلد است، و ارسال به سراسر کشور انجام می‌شود.
      </p>

      <section id="guide" class="mt-12 scroll-mt-28 rounded-[1.5rem] border border-slate/8 bg-white p-6 shadow-card sm:p-8">
        <h2 class="text-xl font-black text-slate">راهنمای خرید</h2>
        <ol class="mt-4 space-y-3 text-sm leading-relaxed text-slate/65">
          <li>۱. کتاب را از هوم، دسته‌بندی یا جستجو پیدا کن و به سبد اضافه کن.</li>
          <li>۲. در سبد، تعداد را تنظیم کن و روش پرداخت را انتخاب کن.</li>
          <li>۳. نام، موبایل و آدرس (یا تحویل حضوری) را وارد کن.</li>
          <li>۴. اگر پرداخت آنلاین باشد به زرین‌پال می‌روی؛ اگر پرداخت در محل باشد همان‌جا سفارش ثبت می‌شود.</li>
        </ol>
      </section>

      <section id="faq" class="mt-6 scroll-mt-28 rounded-[1.5rem] border border-slate/8 bg-white p-6 shadow-card sm:p-8">
        <h2 class="text-xl font-black text-slate">سوالات متداول</h2>
        <dl class="mt-4 space-y-5 text-sm">
          <div>
            <dt class="font-bold text-slate">ارسال چقدر طول می‌کشد؟</dt>
            <dd class="mt-1 leading-relaxed text-slate/60">۳ تا ۵ روز کاری، بسته به شهر گیرنده.</dd>
          </div>
          <div>
            <dt class="font-bold text-slate">کتاب‌ها اصل هستند؟</dt>
            <dd class="mt-1 leading-relaxed text-slate/60">بله. نسخه‌های چاپی ناشر با گارانتی اصالت.</dd>
          </div>
          <div>
            <dt class="font-bold text-slate">برای خرید باید حساب بسازم؟</dt>
            <dd class="mt-1 leading-relaxed text-slate/60">نه. مهمان هم می‌تواند تا پرداخت جلو برود. حساب برای ورود ادمین به داشبورد لازم است.</dd>
          </div>
        </dl>
      </section>

      <section id="returns" class="mt-6 scroll-mt-28 rounded-[1.5rem] border border-slate/8 bg-white p-6 shadow-card sm:p-8">
        <h2 class="text-xl font-black text-slate">بازگشت کالا</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate/60">
          تا ۷ روز پس از تحویل، اگر کتاب آسیب‌دیده یا مغایر باشد، با ایمیل
          <a href="mailto:hello@booklett.ir" class="font-bold text-slate hover:text-slate/70">hello@booklett.ir</a>
          هماهنگ کن. کتاب باید در وضعیت اولیه باشد.
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'درباره Booklett',
  description: 'راهنمای خرید، سوالات متداول و شرایط بازگشت کالا در فروشگاه کتاب Booklett.',
})
</script>
