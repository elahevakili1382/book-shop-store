<template>
  <!-- بخش معرفی کتاب -->
  <section
    class="flex flex-col-reverse sm:flex-row justify-center items-center px-4 gap-10 mt-6
           animate-fadeIn">
    
    <!-- عکس دختر و کتاب -->
    <div class="relative w-48 sm:w-60 lg:w-72 group">
      <!-- دختر -->
      <NuxtImg
        src="/images/img-girl.png"
        alt="reader"
        format="webp"
        class="w-full object-contain transform transition-all duration-500
               group-hover:scale-105 drop-shadow-xl"
      />

      <!-- کتاب -->
      <NuxtImg
        src="/images/Slider-image-(1).png"
        alt="کتاب"
        format="webp"
        class="book-floating absolute w-20 sm:w-24 lg:w-28
               left-[85%] top-[50%] -translate-y-1/2
               transform transition-all duration-300
               "
      />
    </div>

    <!-- متن -->
    <div class="max-w-sm text-right space-y-3 animate-slideUp">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-[#435058] leading-snug">
        کلایو کاسلر
      </h2>
      <p class="text-lg text-gray-500">و بوید موریسون</p>

      <div class="flex flex-row md:flex-col gap-4 mt-4">

        <button
          class="px-6 py-3 rounded-full bg-[#e7e7e7] text-gray-800
                 shadow hover:shadow-lg hover:bg-[#f3f3f3]
                 transition-all duration-300 active:scale-95">
          اطلاعات بیشتر
        </button>

        <button
          class="px-6 py-3 rounded-full bg-fruit-yellow text-black
                 shadow-md hover:shadow-lg hover:bg-[#d6f460]
                 transition-all duration-300 active:scale-95 font-semibold">
          خرید کتاب
        </button>

      </div>
    </div>
  </section>

  <!-- بخش جستجو -->
  <section
    class="w-full max-w-5xl mx-auto mt-0 p-6
           bg-white/60 backdrop-blur-xl border border-white/50
           rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] animate-fadeIn">

    <div class="flex flex-col items-center">

      <!-- فیلد جستجو -->
      <div class="w-full max-w-xl mb-8">
        <form class="relative w-full">
          
          <!-- سرچ -->
      <button type="submit" class="absolute left-4 top-1/2 -translate-y-1/2 text-black">
<AppIcon icon="mdi:magnify" class="w-6 h-6" />
      </button>


          <input
            type="text"
            placeholder="جستجو میان هزاران کتاب..."
            class="w-full rounded-full py-3 px-14 pr-6
                   bg-white/70 backdrop-blur focus:ring-2 focus:ring-fruit-yellow
                   shadow-md text-right font-medium
                   transition-all duration-300"
          />

          <!-- پاک کردن -->
          <button
            type="reset"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </form>
      </div>

      <!-- اسلایدر -->
      <ClientOnly>
      <Swiper
        :slidesPerView="5"
        grab-cursor
        :pagination="{ clickable: true }"
        :modules="[Pagination]"
        :breakpoints="{
          320: { slidesPerView: 3, spaceBetween: 10 },
          640: { slidesPerView: 4, spaceBetween: 15 },
          1024: { slidesPerView: 6, spaceBetween: 20 }
        }"
        class="w-full max-w-5xl"
      >
        <SwiperSlide
          v-for="book in books"
          :key="book.title"
        >
          <div
            class="flex items-center justify-center
                   w-[116px] h-[117px] bg-[#e5e5e5]/60
                   rounded-xl p-2 shadow-sm
                   hover:shadow-xl hover:-translate-y-1
                   transition-all duration-300">
            <NuxtImg
              :src="book.cover"
              width="65"
              height="102"
              class="object-contain"
            />
          </div>
        </SwiperSlide>

      </Swiper>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface Book {
  title: string
  cover: string
}

const books: Book[] = [
  { title: 'Hobbit', cover: '/images/b1.png' },
  { title: 'Hobbit', cover: '/images/b2.png' },
  { title: 'Hobbit', cover: '/images/b3.png' },
  { title: 'Hobbit', cover: '/images/b4.png' },
  { title: 'Hobbit', cover: '/images/b6.png' },
  { title: 'Hobbit', cover: '/images/b5.png' }
]
</script>

<style scoped>
/* انیمیشن‌ها */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn .7s ease-out; }
.animate-slideUp { animation: slideUp .8s ease-out; }

/* کتاب روی دست دختر */
.book-floating {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%   { transform: translateY(-50%) }
  50%  { transform: translateY(-60%) }
  100% { transform: translateY(-50%) }
}

/* pagination */
.swiper-pagination-bullet-active {
  background-color: #DCF763 !important;
}

/* RTL */
section, input, button { direction: rtl; }
</style>
