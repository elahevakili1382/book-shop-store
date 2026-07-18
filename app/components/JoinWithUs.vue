<template>
  <section class="rounded-[2rem] bg-white border border-slate/8 p-8 sm:p-10 shadow-card">
    <div class="flex flex-col md:flex-row items-center gap-8 max-w-[920px] mx-auto">
      <NuxtImg
        src="/images/img.png"
        alt="کتاب"
        class="w-[200px] md:w-[220px] h-auto object-contain shrink-0"
      />

      <div class="flex-1 flex flex-col gap-4 text-center md:text-right">
        <p class="text-xs font-bold tracking-[0.18em] text-slate/45">NEWSLETTER</p>
        <h2 class="text-2xl md:text-3xl font-black text-slate">عضویت در خبرنامه</h2>
        <p class="text-sm md:text-base text-slate/55 leading-relaxed">
          جدیدترین کتاب‌ها و تخفیف‌های ویژه را مستقیم در ایمیلت دریافت کن.
        </p>

        <form
          @submit.prevent="subscribe"
          class="w-full max-w-[420px] mx-auto md:mx-0 relative flex items-center mt-1"
        >
          <input
            v-model="email"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            class="w-full pr-28 pl-4 py-3.5 rounded-full bg-cream border border-slate/10 focus:outline-none focus:ring-1 focus:ring-slate/20 text-right"
          />
          <button
            type="submit"
            class="absolute left-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-slate text-white rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
          >
            عضو شو
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function subscribe() {
  if (!email.value) return
  email.value = ''
}
</script>
