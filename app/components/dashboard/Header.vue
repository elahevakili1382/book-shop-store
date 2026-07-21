<template>
  <header class="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sticky top-0 z-10
           border border-dash-border rounded-2xl m-3 sm:m-4
           bg-dash-card shadow-lg shadow-black/20">
    <button type="button" class="lg:hidden text-xl shrink-0 text-dash-text" aria-label="باز کردن منو"
      @click="$emit('toggle-sidebar')">
      ☰
    </button>

    <!-- سرچ فشرده، روشن — مثل نمونه Dribbble -->
    <form class="relative w-44 sm:w-52 md:w-60 shrink-0" @submit.prevent="onSubmit">
      <AppIcon icon="mdi:magnify"
        class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      <input v-model="query" type="search" name="dashboard-search" autocomplete="off" placeholder="جستجو محصول" class="w-full h-9 pr-9 pl-8 rounded-lg border-0
               bg-[#8888887b] text-gray-900 text-md
               placeholder:text-gray-500 outline-none transition
               focus:ring-2 focus:ring-dash-accent/50" />
      <button v-if="query.length" type="button" class="absolute left-2 top-1/2 -translate-y-1/2 p-0.5 rounded
               text-gray-500 hover:text-gray-800 transition" aria-label="پاک کردن جستجو" @click="clearSearch">
        <AppIcon icon="mdi:close" class="w-3.5 h-3.5" />
      </button>
    </form>

    <div class="flex-1 min-w-0" />

    <div class="relative w-9 h-9 flex items-center justify-center shrink-0
             border border-dash-border rounded-full bg-dash-bg
             hover:border-dash-accent/40 transition-colors">
      <AppIcon icon="mdi:email-outline" class="text-dash-accent w-4 h-4" />
      <span class="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-400
               rounded-full border-2 border-dash-card" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDashboardSearch } from '../../composables/useDashboardSearch'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const { query } = useDashboardSearch()

function onSubmit() {
  const q = query.value.trim()
  if (!q) return
  if (route.path !== '/dashboard/products') {
    return navigateTo({ path: '/dashboard/products', query: { q } })
  }
}

function clearSearch() {
  query.value = ''
  if (route.path === '/dashboard/products') {
    navigateTo({ path: '/dashboard/products', query: {} })
  }
}
</script>
