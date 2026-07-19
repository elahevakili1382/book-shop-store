<template>
  <header
    class="flex items-center gap-4 px-4 sm:px-6 py-3.5
           sticky top-0 z-10 border border-[#2A2D36]
           rounded-2xl m-3 sm:m-4 shadow-lg shadow-black/20"
    style="background:#1C1E24"
  >
    <button
      type="button"
      class="lg:hidden text-xl shrink-0 text-[#F5F2EB]"
      aria-label="باز کردن منو"
      @click="$emit('toggle-sidebar')"
    >
      ☰
    </button>

    <div class="flex-1 relative">
      <input
        type="text"
        placeholder="جستجو..."
        class="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-[#2A2D36]
               text-[#F5F2EB] placeholder:text-[#A8A29E] outline-none
               focus:ring-1 focus:ring-[#DCF763]/40 focus:border-[#DCF763]/40"
        style="background:#14151A"
      />
      <svg
        class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0z"
        />
      </svg>
    </div>

    <div
      class="relative w-10 h-10 flex items-center justify-center
             border border-[#2A2D36] rounded-full
             hover:border-[#DCF763]/40 shrink-0 transition-colors"
      style="background:#14151A"
    >
      <AppIcon icon="mdi:email" class="text-[#DCF763] w-5 h-5" />
      <span
        class="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-400
               rounded-full border-2 border-[#1C1E24]"
      />
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle-sidebar'])
</script>
