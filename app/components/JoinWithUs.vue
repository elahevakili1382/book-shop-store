<template>
  <section class="overflow-hidden rounded-[1.75rem] border border-slate/10 bg-white sm:rounded-[2rem]">
    <div class="grid lg:grid-cols-[0.35rem_minmax(0,1fr)]">
      <div class="hidden bg-lime lg:block" aria-hidden="true" />

      <div class="grid items-center gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-10 lg:py-11">
        <div class="text-center lg:text-right">
          <p class="text-xs font-bold text-slate/45">خبرنامه</p>
          <h2 class="mt-2 text-2xl font-black text-slate sm:text-3xl">کتاب بعدی را زودتر خبر می‌کنیم</h2>
          <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate/55 lg:mx-0">
            تازه‌ها، تخفیف روز و عنوان‌های منتخب — هفته‌ای یک‌بار، بدون اسپم.
          </p>

          <form
            class="mx-auto mt-6 flex max-w-md overflow-hidden rounded-2xl border border-slate/10 bg-cream p-1.5 lg:mx-0"
            @submit.prevent="subscribe"
          >
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="ایمیل‌ات را بنویس"
              class="min-w-0 flex-1 bg-transparent px-4 text-right text-sm font-medium text-slate outline-none placeholder:text-slate/35"
            />
            <button
              type="submit"
              class="shrink-0 rounded-xl bg-slate px-5 py-2.5 text-sm font-bold text-white hover:bg-slate/90"
            >
              عضو شو
            </button>
          </form>
          <p v-if="done" class="mt-3 text-sm font-bold text-slate">ثبت شد. به محض انتشار تازه‌ها خبرت می‌کنیم.</p>
        </div>

        <ul class="grid gap-2 text-sm text-slate">
          <li class="flex items-center gap-3 rounded-2xl border border-slate/8 bg-cream px-4 py-3">
            <span class="h-2 w-2 shrink-0 rounded-full bg-lime" />
            هفته‌ای یک ایمیل، نه بیشتر
          </li>
          <li class="flex items-center gap-3 rounded-2xl border border-slate/8 bg-cream px-4 py-3">
            <span class="h-2 w-2 shrink-0 rounded-full bg-lime" />
            کد تخفیف مخصوص اعضا
          </li>
          <li class="flex items-center gap-3 rounded-2xl border border-slate/8 bg-cream px-4 py-3">
            <span class="h-2 w-2 shrink-0 rounded-full bg-lime" />
            لغو اشتراک، هر وقت بخواهی
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const done = ref(false)
const toast = useToast()

function subscribe() {
  if (!email.value) return
  done.value = true
  toast.success({
    message: 'ایمیل در خبرنامه ثبت شد',
    position: 'topRight',
    timeout: 2200,
  })
  email.value = ''
}
</script>
