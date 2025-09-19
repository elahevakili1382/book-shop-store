<template>
  <section
    class="w-full min-h-[400px] md:min-h-[300px] bg-gray-vector flex items-center justify-center overflow-hidden mb-10 py-12 px-4"
  >
    <div
      class="flex flex-col md:flex-row justify-center items-center gap-8 p-8 w-full max-w-[920px] rounded-[40px] backdrop-blur-[30px] border border-gray-300 shadow-lg"
    >
      <!-- تصویر بدون div اضافی -->
      <NuxtImg
        src="/images/img.png"
        alt="کتاب"
        class="w-[240px] md:w-[250px] h-auto mx-auto md:mx-0 object-contain"
      />

      <!-- متن و فرم -->
      <div class="flex flex-col gap-5 text-center md:text-right">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800">عضو شدن در خبرنامه</h2>
        <p class="text-sm md:text-base text-gray-600 leading-relaxed">
          با عضویت در خبرنامه ما، جدیدترین کتاب‌ها و تخفیف‌ها را مستقیماً در ایمیل خود دریافت کنید.
        </p>

        <form @submit.prevent="subscribe" class="w-full max-w-[400px] mx-auto md:mx-0 relative flex items-center">
          <input
            v-model="email"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            class="w-full pr-28 px-14 py-3 rounded-[50px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DCF763] transition"
          />
          <NuxtImg
            src="/images/email-icon.svg"
            alt="ایمیل"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
          <button
            type="submit"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#DCF763] rounded-[50px] text-gray-800 font-semibold hover:bg-[#c4d94f] transition shadow-md"
          >
            عضو شدن
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
  if (!email.value) {
    alert('لطفاً ایمیل خود را وارد کنید')
    return
  }
  console.log('ایمیل ثبت شد:', email.value)
  email.value = ''
}
</script>

<style scoped>
.bg-gray-vector {
  background-image: url('/images/Vector%20(4).svg'), url('/images/Vector%20(4).svg');
  background-repeat: no-repeat, no-repeat;
  background-position: top right, bottom left;
  background-size: 200px 120px, 200px 120px;
}
</style>
