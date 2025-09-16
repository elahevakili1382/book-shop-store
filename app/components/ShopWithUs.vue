<template>
  <section class="flex flex-row w-full bg-[#DCF763] h-[600px] mt-[80px] overflow-hidden relative">
    <!-- بخش متن -->
    <div class="flex flex-col justify-center px-10 w-[800px] h-full gap-[22px] z-20">
      <h2 class="text-black text-2xl font-bold md:text-4xl text-center">چرا خرید از ما ؟</h2>
      <p class="font-500 flex items-center text-center text-[#435058]">
        Lorem Ipsum s simply dummy text of the printing and typesetting industry.
      </p>
      <button
        class="border-box flex justify-center items-center gap-[10px] px-[20px] py-[8px] text-[#DCF763] bg-[#435058] border-1 border-[#435058] rounded-full self-center hover:bg-[#5b6a6a] hover:scale-105"
      >
        خواندن بیشتر
      </button>
    </div>

    <!-- بخش کتاب‌ها -->
    <div class="hidden md:block w-full relative h-full">
      <div
        v-for="(book, index) in rotatedBooks"
        :key="book.id"
        class="absolute transition duration-300 hover:scale-105"
        :style="{
          top: book.position.top + 'px',
          left: book.position.left + 'px',
          transform: `rotate(${book.position.rotate}deg)`,
          transformOrigin: book.position.transformOrigin || 'center center',
          zIndex: 10 - index,
          width: '180px',
        }"
      >
        <div class="flex flex-col justify-center items-center py-2 max-w-[210px] h-[300px]">
          <div class="w-full flex-shrink-0">
            <img
              :src="book.cover"
              alt="book image"
              class="w-[200px] h-[230px] object-cover object-top rounded-xl"
            />
          </div>
          <p class="text-[#848C8E] text-xs w-full px-4 mb-1">{{ book.author }}</p>
          <h2 class="text-lg font-bold w-full px-4 mb-1 truncate">{{ book.title }}</h2>
          <!-- <p class="text-[#848C8E] text-xs w-full px-4 mb-2">قیمت کتاب</p>
          <h2 class="text-lg font-semibold w-full px-4 mb-4">{{ book.price }}</h2> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Position {
  top: number
  left: number
  rotate: number
  transformOrigin?: string
}

interface BookPositioned {
  id: string
  title: string
  price: string
  author: string
  cover: string
  position: Position
}

const rotatedBooks = ref<BookPositioned[]>([])

// داده استاتیک اولیه
const staticBooks: Omit<BookPositioned, 'position'>[] = [
  { id: '1', title: 'خرید آنلاین در عصر دیجیتال', price: '۵۰,۰۰۰ تومان', author: 'احمدرضا غفاری', cover: '/images/Rectangle-4173-(3).png' },
  { id: '2', title: 'برنامه‌نویسی با Vue 3', price: '۷۰,۰۰۰ تومان', author: 'مهدی صادقی', cover: '/images/Rectangle-4173-(2).png' },
  { id: '3', title: 'هوش مصنوعی و یادگیری ماشین', price: '۸۰,۰۰۰ تومان', author: 'سارا موسوی', cover: '/images/Rectangle-4173-(5).png' },
  { id: '4', title: 'طراحی رابط کاربری مدرن', price: '۹۰,۰۰۰ تومان', author: 'نیما خانی', cover: '/images/Rectangle-4173-(3).png' },
  { id: '5', title: 'اقتصاد کلان برای همه', price: '۶۰,۰۰۰ تومان', author: 'پریسا راد', cover: '/images/Rectangle-4173-(5).png' },
  { id: '6', title: 'مبانی شبکه‌های کامپیوتری', price: '۷۵,۰۰۰ تومان', author: 'حسن کریمی', cover: '/images/Rectangle-4173.png' },
  { id: '7', title: 'کتاب داستان کوتاه فارسی', price: '۶۵,۰۰۰ تومان', author: 'الهام احمدی', cover: '/images/Rectangle-4173-(4).png' },
  { id: '8', title: 'برنامه‌نویسی TypeScript از پایه', price: '۸۵,۰۰۰ تومان', author: 'محمد شریفی', cover: '/images/Rectangle-4173.png' },
  { id: '9', title: 'تاریخ ادبیات ایران', price: '۹۵,۰۰۰ تومان', author: 'فاطمه جباری', cover: '/images/Rectangle-4173-(4).png' },
]


const positions: Position[] = [
  { top: -20, left: 140, rotate: 15, transformOrigin: 'top right' },
  { top: -60, left: 400, rotate: 15, transformOrigin: 'top right' },
  { top: -120, left: 640, rotate: 15, transformOrigin: 'top right' },
  { top: 260, left: 60, rotate: 15, transformOrigin: 'top right' },
  { top: 220, left: 330, rotate: 15, transformOrigin: 'top right' },
  { top: 160, left: 580, rotate: 15, transformOrigin: 'top right' },
  { top: 580, left: 1, rotate: 15, transformOrigin: 'top right' },
  { top: 530, left: 250, rotate: 15, transformOrigin: 'top right' },
  { top: 460, left: 500, rotate: 15, transformOrigin: 'top right' },
]

function initBooks(books: Omit<BookPositioned, 'position'>[]) {
  rotatedBooks.value = books.map((b, i) => ({
    ...b,
    position: positions[i] || { top: 0, left: 0, rotate: 0 },
  }))
}

onMounted(() => {
  // استفاده از استاتیک
  initBooks(staticBooks)
  animateBooks()
})

function animateBooks() {
  const speed = 0.5
  function step() {
    rotatedBooks.value.forEach((book) => {
      book.position.top += speed
      if (book.position.top > 600) book.position.top = -300
    })
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
</script>
