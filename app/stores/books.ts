// stores/books.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  price: string
  position?: Position
}

export interface Position {
  top: string
  left: string
  rotate: number
  transformOrigin?: string
}

const staticBooks: Book[] = [
  { id: '1', cover: '/images/Rectangle-4173-(3).png', title: 'کتاب اول', price: '۵۰,۰۰۰ تومان', author: 'نویسنده اول' },
  { id: '2', cover: '/images/Rectangle-4173-(2).png', title: 'کتاب دوم', price: '۷۰,۰۰۰ تومان', author: 'نویسنده دوم' },
  { id: '3', cover: '/images/Rectangle-4173-(5).png', title: 'کتاب سوم', price: '۸۰,۰۰۰ تومان', author: 'نویسنده سوم' },
  { id: '4', cover: '/images/Rectangle-4173-(3).png', title: 'کتاب چهارم', price: '۹۰,۰۰۰ تومان', author: 'نویسنده چهارم' },
  { id: '5', cover: '/images/Rectangle-4173-(5).png', title: 'کتاب پنجم', price: '۶۰,۰۰۰ تومان', author: 'نویسنده پنجم' },
  { id: '6', cover: '/images/Rectangle-4173.png', title: 'کتاب ششم', price: '۷۵,۰۰۰ تومان', author: 'نویسنده ششم' },
  { id: '7', cover: '/images/Rectangle-4173-(4).png', title: 'کتاب هفتم', price: '۶۵,۰۰۰ تومان', author: 'نویسنده هفتم' },
  { id: '8', cover: '/images/Rectangle-4173.png', title: 'کتاب هشتم', price: '۸۵,۰۰۰ تومان', author: 'نویسنده هشتم' },
  { id: '9', cover: '/images/Rectangle-4173-(4).png', title: 'کتاب نهم', price: '۹۵,۰۰۰ تومان', author: 'نویسنده نهم' },
]

export const useBookStore = defineStore('books', () => {
  const books = ref<Book[]>(staticBooks)

  return { books }
})
