<template>
  <footer class="bg-[#F1F2EE] mt-10 py-12 px-6 rounded-xl shadow-md">

    <!-- گرید ۴ ستونه -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">

      <!-- ستون ۱ -->
      <div class="transition hover:scale-[1.03]">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-4 text-[#323a40]">
<AppIcon icon="mdi:book" class="text-[#6b8e23]" />
          انتشارات بوکز
        </h2>
        <ul class="space-y-2 text-lg text-[#435058] font-medium">
          <li><NuxtLink class="footer-link" to="/">درباره ما</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">انتشارات</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">پرفروش‌ها</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">همکاری</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">تماس با ما</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۲ -->
      <div class="transition hover:scale-[1.03]">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-4 text-[#323a40]">
<AppIcon icon="mdi:user" class="text-[#6b8e23]" />
          حساب من
        </h2>
        <ul class="space-y-2 text-lg text-[#435058] font-medium">
          <li><NuxtLink class="footer-link" to="/">سفارشات</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">کتابخانه</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">اطلاعات کاربری</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">امنیت</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۳ -->
      <div class="transition hover:scale-[1.03]">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-4 text-[#323a40]">
<AppIcon icon="mdi:headset" class="text-[#6b8e23]" />
          پشتیبانی
        </h2>
        <ul class="space-y-2 text-lg text-[#435058] font-medium">
          <li><NuxtLink class="footer-link" to="/">راهنمای خرید</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">سوالات متداول</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">بازگشت کالا</NuxtLink></li>
          <li><NuxtLink class="footer-link" to="/">پشتیبانی</NuxtLink></li>
        </ul>
      </div>

      <!-- ستون ۴ -->
      <div class="transition hover:scale-[1.03]">
        <h2 class="flex items-center gap-2 text-2xl font-bold mb-4 text-[#323a40]">
<AppIcon icon="mdi:id-card" class="text-[#6b8e23]" />
          اطلاعات تماس
        </h2>
        <ul class="space-y-2 text-lg text-[#435058] font-medium">
          <li class="flex items-center gap-2">
<AppIcon icon="mdi:map-marker" class="text-[#6b8e23]" />
            تهران، میدان انقلاب
          </li>
          <li class="flex items-center gap-2">
<AppIcon icon="mdi:phone" class="text-[#6b8e23]" />
            <a href="tel:+9194038XXXX" class="footer-link">+91 94038 XXXX</a>
          </li>
          <li class="flex items-center gap-2">
<AppIcon icon="mdi:email-outline" class="text-[#6b8e23]" />
            <a href="mailto:elahevakili8@gmail.com" class="footer-link">
              elahevakili8@gmail.com
            </a>
          </li>
        </ul>

        <div class="flex gap-3 mt-5">
          <a class="social-icon bg-[#4267B2]"><AppIcon name="fa6-brands:facebook-f" />
</a>
          <a class="social-icon bg-[#1DA1F2]"><AppIcon name="fa6-brands:twitter" />
 </a>
          <a class="social-icon bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
<AppIcon icon="mdi:instagram" />
          </a>
          <a class="social-icon bg-[#0077b5]"><AppIcon name="fa6-brands:linkedin-in" />
 </a>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped lang="postcss">
.footer-link {
  @apply hover:text-[#6b8e23] transition-colors cursor-pointer;
}

.social-icon {
  @apply w-9 h-9 flex items-center justify-center rounded-full text-white text-base 
         hover:brightness-110 transition-all cursor-pointer;
}
</style>
