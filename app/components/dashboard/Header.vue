<template>
  <header class="flex items-center justify-between px-6 py-4 shadow sticky top-0 z-10 bg-white rounded-lg">
    <div class="flex-1 max-w-md relative flex items-center">
      <!-- آیکون سمت چپ -->
     

      <!-- input با padding کافی برای آیکون -->
      <input
        type="text"
        placeholder="جستجو..."
        class="pl-10 pr-8 py-2 text-l rounded-2xl border border-blue-600 focus:ring-3 focus:ring-blue-200 outline-none w-full"
      />

      <!-- آیکون جستجو سمت راست -->
      <svg
        class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
      </svg>
    </div>

     <div class="left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center relative">
        <FontAwesome :icon="['fas','envelope']" class="text-blue-600 w-5 h-5" />
      </div>
  </header>
</template>
