<template>
  <footer class="grid grid-cols-2 md:grid-cols-5 gap-8 px-6 py-8 bg-[#F1F2EE] text-right mt-5">
    <!-- ستون ۱: انتشارات بوکز -->
    <div>
      <h2 class="text-2xl font-bold mb-3 text-[#323a40]">انتشارات بوکز</h2>
      <ul class="space-y-2 text-lg text-[#435058]">
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">درباره ما</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">انتشارات ما</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">کتاب‌های پرفروش</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">همکاری با ما</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">تماس با ما</NuxtLink></li>
      </ul>
    </div>

    <!-- ستون ۲: حساب من -->
    <div>
      <h2 class="text-2xl font-bold mb-3 text-[#323a40]">حساب من</h2>
      <ul class="space-y-2 text-lg text-[#435058]">
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">سفارشات من</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">کتابخانه شخصی</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">اطلاعات کاربری</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">تنظیمات امنیت</NuxtLink></li>
      </ul>
    </div>

    <!-- ستون ۳: پشتیبانی -->
    <div>
      <h2 class="text-2xl font-bold mb-3 text-[#323a40]">پشتیبانی</h2>
      <ul class="space-y-2 text-lg text-[#435058]">
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">راهنمای خرید</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">سوالات متداول</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">شرایط بازگشت</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">تماس با پشتیبانی</NuxtLink></li>
      </ul>
    </div>

    <!-- ستون ۴: خدمات -->
    <div>
      <h2 class="text-2xl font-bold mb-3 text-[#323a40]">خدمات</h2>
      <ul class="space-y-2 text-lg text-[#435058]">
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">انتشار کتاب</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">کتاب‌های دیجیتال</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">عضویت ویژه</NuxtLink></li>
        <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">مشاوره چاپ</NuxtLink></li>
      </ul>
    </div>

    <!-- ستون ۵: اطلاعات تماس و شبکه‌های اجتماعی -->
    <div>
      <NuxtImg
  src="/images/brand-logo-(2).png"
  alt="لوگوی انتشارات بوکز"
  class="mb-6 w-[120px] h-auto"
/>

      <h2 class="text-2xl font-bold mb-3 text-[#323a40]">اطلاعات تماس</h2>
      <ul class="space-y-2 text-lg font-semibold text-[#435058]">
        <li>آدرس: <span class="font-medium">تهران، میدان انقلاب، کوچه نور</span></li>
        <li>
          تلفن:
          <a href="tel:+9194038XXXX" class="font-medium hover:text-[#6b8e23] transition-colors">+91 94038 XXXX</a>
        </li>
        <li>
          ایمیل:
          <a href="mailto:elahevakili8@gmail.com" class="font-medium hover:text-[#6b8e23] transition-colors">
            elahevakili8@gmail.com
          </a>
        </li>
      </ul>

      <h3 class="text-lg font-bold mb-3 mt-6 text-[#323a40]">ما را دنبال کنید</h3>
      <!--
      <div class="flex gap-4">
        <a href="#" class="hover:scale-110 transition-transform">
          <NuxtImg src="/images/fb.svg" alt="فیسبوک" width="24" height="24" />
        </a>
        <a href="#" class="hover:scale-110 transition-transform">
          <NuxtImg src="/images/twitter.svg" alt="توییتر" width="24" height="24" />
        </a>
        <a href="#" class="hover:scale-110 transition-transform">
          <NuxtImg src="/images/instagram.svg" alt="اینستاگرام" width="24" height="24" />
        </a>
      </div>
      -->
    </div>
  </footer>
</template>

<script setup lang="ts">
// این کامپوننت صرفاً نمایش است و نیاز به Store ندارد
</script>
