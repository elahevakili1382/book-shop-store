// server/api/members.get.ts
import { defineEventHandler } from 'h3'

interface Member {
  id: string
  name: string
  role: string
  image: string
}

export default defineEventHandler(async (event) => {
  // داده‌های ثابت اعضای تیم
  const members: Member[] = [
    { id: '1', name: 'علی رضایی', role: 'مدیر پروژه، نظارت بر تمامی پروژه ها' , image: '/images/client1.jpg' },
    { id: '2', name: 'سارا احمدی', role: 'توسعه‌دهنده نکمیل پروژه و ویرایش قسمت های لازم ', image: '/images/client2.jpg' },
    { id: '3', name: 'مهدی کریمی', role: 'طراح UI/UX، بازطراحی قسمت های مهم به صورت خلاقانه', image: '/images/client3.jpg' },
    { id: '3', name: 'مهدی کریمی', role: 'طراح UI/UX، بازطراحی قسمت های مهم به صورت خلاقانه', image: '/images/client4.jpg' },

  ]

   if (!members.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No members found',
    })
  }
  return members
})
