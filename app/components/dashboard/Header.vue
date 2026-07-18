<template>
  <header
    class="flex items-center gap-4 px-4 sm:px-6 py-4
           shadow sticky top-0 z-10 bg-white rounded-lg m-3" 
  >
    <!-- ☰ موبایل -->
    <button
      class="lg:hidden text-2xl shrink-0"
      @click="$emit('toggle-sidebar')"
    >
      ☰
    </button>

    <!-- search -->
    <div class="flex-1 relative">
      <input
        type="text"
        placeholder="جستجو..."
        class="w-full pr-9 py-2 rounded-3xl bg-gray-100 outline-none
               focus:ring-2 focus:ring-blue-200"
      />
      <svg
        class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
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

    <!-- notification -->
    <div
      class="relative w-10 h-10 flex items-center justify-center
             bg-gray-100 rounded-full hover:bg-gray-200 shrink-0"
    >
      <AppIcon icon="mdi:email" class="text-blue-600 w-5 h-5" />
      <span
        class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500
               rounded-full border-2 border-white"
      />
    </div>
  </header>
</template>

<script setup></script>