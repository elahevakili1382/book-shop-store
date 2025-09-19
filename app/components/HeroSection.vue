<template>
  <!-- بخش معرفی کتاب -->
  <section
    class="flex flex-col-reverse sm:flex-row justify-center items-center px-4 gap-4 sm:gap-8 mt-3"
  >
    <!-- عکس دختر و کتاب -->
    <div class="relative w-48 sm:w-40 md:w-56 lg:w-64">
      <!-- عکس دختر -->
      <NuxtImg
        src="/images/img-girl.png"
        alt="reader"
       
        format="webp"
        class="w-full max-w-none object-contain scale-110 md:scale-100 transition-transform duration-300"
      />

      <!-- عکس کتاب داخل div -->
      <NuxtImg
        src="/images/Slider-image-(1).png"
        alt="کتاب Marauder"
       
        format="webp"
        class="book-overlay absolute w-1 sm:w-10 md:w-28 lg:w-32 left-[90%] top-[50%] -translate-y-1/2"
      />
    </div>

    <!-- متن -->
    <div class="max-w-xs mr-10 sm:mt-0 text-right">
      <h2 class="text-2xl lg:text-3xl font-bold">کلایو کاسلر</h2>
      <p class="text-md mt-2 text-gray-500">و بوید موریسون</p>
      <div class="flex flex-row md:flex-col gap-4 mt-1">
        <button
          class="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded-full text-md"
          role="link"
        >
          اطلاعات بیشتر
        </button>
        <button
          class="bg-lime-400 text-black px-4 py-2 rounded-full text-md hover:bg-lime-600"
          role="link"
        >
          خرید کتاب
        </button>
      </div>
    </div>
  </section>

  <!-- بخش جستجو -->
  <section
    class="w-full max-w-5xl mx-auto bg-white/45 border border-gray-100 backdrop-blur-lg rounded-3xl p-3 md:p-6 shadow-2xl"
  >
    <div class="flex flex-col items-center">
      <div class="w-full max-w-xl mb-6">
        <form class="relative w-full">
          <!-- دکمه سرچ -->
          <button
            type="submit"
            aria-label="جستجو"
            class="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
              class="w-5 h-5"
            >
              <path
                d="M9 15a6 6 0 100-12 6 6 0 000 12zM15 15l-3-3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>

          <!-- فیلد ورودی -->
          <input
            type="text"
            placeholder="جستجو..."
            class="w-full rounded-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:border-blue-600 placeholder-gray-400 transition-all duration-300 shadow-md text-right font-bold"
            required
          />

          <!-- دکمه پاک کردن -->
          <button
            type="reset"
            aria-label="پاک کردن جستجو"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </form>
      </div>

      <!-- اسلایدر کتاب‌ها -->
    <ClientOnly>
  <Swiper
    :slidesPerView="5"
    :pagination="{ clickable: true }"
    :modules="[Pagination]"
    grab-cursor
    :breakpoints="{
      320: { slidesPerView: 3, spaceBetween: 10 },   // موبایل
      640: { slidesPerView: 4, spaceBetween: 15 },   // تبلت
      1024: { slidesPerView: 6, spaceBetween: 20 }   // دسکتاپ
    }"
    class="w-full max-w-5xl"
  >
<SwiperSlide
  v-for="book in books"
  :key="book.title"
>
  <!-- دیو خاکستری -->
  <div
    class="flex items-center justify-center
           w-[116px] h-[117px] sm:w-[100px] sm:h-[105px] md:w-[116px] md:h-[117px]
           bg-[#cdcdc34a] rounded-md p-1"
  >
    <!-- عکس -->
    <NuxtImg
      :src="book.cover"
      :alt="book.title"
      width="65"
      height="102"
      format="webp"
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
import { NuxtImg } from '#components'

interface Book {
  title: string
  cover: string
}

const books: Book[] = [
  { title: 'The Hobbit', cover: '/images/b1.png' },
  { title: 'The Hobbit', cover: '/images/b2.png' },
  { title: 'The Hobbit', cover: '/images/b3.png' },
  { title: 'The Hobbit', cover: '/images/b4.png' },
  { title: 'The Hobbit', cover: '/images/b6.png' },
  { title: 'The Hobbit', cover: '/images/b5.png' },
]
</script>

<style scoped>

/* pagination سفارشی */
/* .swiper-pagination-bullet {
  background-color: #aaa;
  opacity: 1;
  width: 12px;
  height: 12px;
  margin: 0 6px !important;
  border-radius: 50%;
  transition: background-color 0.3s;
} */
.swiper-pagination-bullet-active {
  background-color: #dce763;
}

/* تنظیمات responsive کتاب روی دست دختر */
.book-overlay {
  transition: all 0.3s ease;
}
@media (max-width: 640px) {
  .book-overlay {
    left: 55% !important;
    bottom: 18% !important;
    width: 5rem !important;
  }
}
@media (min-width: 641px) and (max-width: 1024px) {
  .book-overlay {
    left: 58% !important;
    bottom: 20% !important;
    width: 7rem !important;
  }
}
@media (min-width: 1025px) {
  .book-overlay {
    left: 60% !important;
    bottom: 20% !important;
    width: 9rem !important;
  }
}

/* راست‌چین کل کامپوننت */
section,
input,
button {
  direction: rtl;
}
</style>
