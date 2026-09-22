<template>
  <div class="flex min-h-dvh overflow-x-hidden bg-dash-bg text-dash-text">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 right-0 z-40 w-[min(18rem,86vw)] border-l border-dash-border bg-dash-card transition-transform duration-300 lg:static lg:w-60 lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    >
      <Sidebar />
    </aside>

    <div class="flex min-h-dvh min-w-0 flex-1 flex-col bg-dash-bg">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main
        class="min-w-0 flex-1 px-4 pt-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pb-8"
      >
        <NuxtPage />
      </main>
    </div>

    <DashBottomNav @more="isSidebarOpen = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Sidebar from '../components/dashboard/sidebar.vue'
import Header from '../components/dashboard/Header.vue'
import DashBottomNav from '../components/dashboard/DashBottomNav.vue'

const route = useRoute()
const isSidebarOpen = ref(false)

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false
  }
)
</script>
