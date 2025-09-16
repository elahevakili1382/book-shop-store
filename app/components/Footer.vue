<template>
  <footer class="bg-[#F1F2EE] text-right mt-5 p-8 md:p-10 rounded-xl shadow-lg">
    <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
      <!-- ستون ۱: انتشارات بوکز -->
      <div class="hover:scale-[1.02] transition-transform duration-200">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-3 text-[#323a40]">
          <FontAwesome icon="fa-solid fa-book" class="text-[#6b8e23]" />
          انتشارات بوکز
        </h2>
        <ul class="space-y-2 text-lg text-[#435058]">
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">درباره ما</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">انتشارات ما</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">کتاب‌های پرفروش</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">همکاری با ما</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">تماس با ما</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۲: حساب من -->
      <div class="hover:scale-[1.02] transition-transform duration-200">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-3 text-[#323a40]">
          <FontAwesome icon="fa-solid fa-user" class="text-[#6b8e23]" />
          حساب من
        </h2>
        <ul class="space-y-2 text-lg text-[#435058]">
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">سفارشات من</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">کتابخانه شخصی</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">اطلاعات کاربری</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">تنظیمات امنیت</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۳: پشتیبانی -->
      <div class="hover:scale-[1.02] transition-transform duration-200">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-3 text-[#323a40]">
          <FontAwesome icon="fa-solid fa-headset" class="text-[#6b8e23]" />
          پشتیبانی
        </h2>
        <ul class="space-y-2 text-lg text-[#435058]">
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">راهنمای خرید</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">سوالات متداول</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">شرایط بازگشت</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">تماس با پشتیبانی</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۴: خدمات -->
      <div class="hover:scale-[1.02] transition-transform duration-200">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-3 text-[#323a40]">
          <FontAwesome icon="fa-solid fa-handshake" class="text-[#6b8e23]" />
          خدمات
        </h2>
        <ul class="space-y-2 text-lg text-[#435058]">
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">انتشار کتاب</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">کتاب‌های دیجیتال</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">عضویت ویژه</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-[#6b8e23] transition-colors">مشاوره چاپ</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۵: اطلاعات تماس و شبکه‌های اجتماعی -->
      <div class="flex flex-col justify-between bg-gradient-to-t from-[#f1f2ee] to-[#e2e5e2] p-4 rounded-lg shadow-inner hover:shadow-lg transition-shadow duration-300">
        <NuxtImg src="/images/brand-logo-(2).png" alt="لوگوی انتشارات بوکز" class="mb-4 w-[120px] h-auto" />

        <h2 class="flex items-center gap-2 text-2xl font-bold mb-3 text-[#323a40]">
          <FontAwesome icon="fa-solid fa-address-card" class="text-[#6b8e23]" />
          اطلاعات تماس
        </h2>
        <ul class="space-y-2 text-lg font-semibold text-[#435058]">
          <li class="flex items-center gap-2">
            <FontAwesome icon="fa-solid fa-location-dot" class="text-[#6b8e23]" />
            <span>تهران، میدان انقلاب، کوچه نور</span>
          </li>
          <li class="flex items-center gap-2">
            <FontAwesome icon="fa-solid fa-phone" class="text-[#6b8e23]" />
            <a href="tel:+9194038XXXX" class="hover:text-[#6b8e23] transition-colors">+91 94038 XXXX</a>
          </li>
          <li class="flex items-center gap-2">
            <FontAwesome icon="fa-regular fa-envelope" class="text-[#6b8e23]" />
            <a href="mailto:elahevakili8@gmail.com" class="hover:text-[#6b8e23] transition-colors">
              elahevakili8@gmail.com
            </a>
          </li>
        </ul>

        <h3 class="text-lg font-bold mb-3 mt-6 text-[#323a40]">ما را دنبال کنید</h3>
        <div class="flex gap-3">
          <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#4267B2] text-white hover:bg-[#365899] transition-colors" aria-label="Facebook">
            <FontAwesome icon="fa-brands fa-facebook-f" />
          </a>
          <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:bg-[#0d95e8] transition-colors" aria-label="Twitter">
            <FontAwesome icon="fa-brands fa-twitter" />
          </a>
          <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:opacity-90 transition-all" aria-label="Instagram">
            <FontAwesome icon="fa-brands fa-instagram" />
          </a>
          <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077b5] text-white hover:bg-[#005582] transition-colors" aria-label="LinkedIn">
            <FontAwesome icon="fa-brands fa-linkedin-in" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// اینجا چیزی لازم نیست چون FontAwesome global رجیستر شده
</script>
