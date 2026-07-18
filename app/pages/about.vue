<template>
  <section class="max-w-[1400px] mx-auto px-4 py-16">
    <div class="flex flex-col md:flex-row gap-12 items-center">
      <!-- متن -->
      <div class="flex-1 space-y-6 text-center md:text-right">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-[#0b1f2dcb] mb-4">درباره ما</h2>
        <p class="text-gray-700 text-base sm:text-lg leading-relaxed">
          BookShop جاییست که عاشقان کتاب می‌توانند بهترین کتاب‌ها را کشف کنند، خریدی امن داشته باشند و همیشه از پیشنهادهای روز بهره‌مند شوند.
        </p>

        <h3 class="text-xl font-semibold mt-6 text-[#0b1f2dcb]" >دستاوردهای ما</h3>
        <p class="text-[#0c161dcb] text-base sm:text-lg leading-relaxed">
          ارائه تجربه خرید آسان و لذت‌بخش، دسترسی به هزاران کتاب متنوع و پیشنهادات روزانه برای کاربران.
        </p>

        <h3 class="text-xl font-semibold mt-6 text-[#0b1f2dcb]">خواندن کتاب‌های ما در هر دستگاهی</h3>
        <p class="text-gray-700 text-base sm:text-lg leading-relaxed">
          با BookShop می‌توانید کتاب‌ها را روی موبایل، تبلت و دسکتاپ خود مطالعه کنید و تجربه‌ای بدون مرز داشته باشید.
        </p>

        <h3 class="text-xl font-semibold mt-6 text-[#0b1f2dcb]">کیفیت بالا</h3>
        <p class="text-gray-700 text-base sm:text-lg leading-relaxed">
          تمامی کتاب‌ها با بالاترین کیفیت ارائه می‌شوند و تجربه خرید و مطالعه‌ای عالی را برای شما فراهم می‌کنیم.
        </p>
      </div>

      <!-- تصویر -->
      <div class="flex-1 flex justify-center items-center">
        <NuxtImg
          src="/images/education-concept-with-book.jpg"
          alt="درباره ما"
          class="rounded-2xl shadow-lg object-cover w-full max-w-[500px] h-auto"
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
