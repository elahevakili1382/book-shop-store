<template>
  <header
    class="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4 shadow sticky top-0 z-10 bg-white rounded-lg"
  >
    <!-- 🔍 بخش جستجو -->
    <div class="flex-1 min-w-[200px] sm:min-w-[250px] md:min-w-[250px] max-w-md relative flex items-center">
      <input
        type="text"
        placeholder="جستجو..."
        class="w-full pr-9 py-2 text-base rounded-3xl bg-gray-100 outline-none focus:ring-2 focus:ring-blue-200"
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
          d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
        />
      </svg>
    </div>

    <!-- ✉️ آیکون پیام -->
    <div
      class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition cursor-pointer relative"
    >
<AppIcon icon="mdi:email" class="text-blue-600 w-5 h-5" />
      <!-- نوتیف کوچیک -->
      <span
        class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
      ></span>
    </div>
  </header>
</template>


<style scoped>
@media (max-width: 640px) {
  header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
