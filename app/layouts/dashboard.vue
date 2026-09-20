<template>
  <div class="flex min-h-screen overflow-x-hidden text-[#F5F2EB]" style="background:#14151A">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 right-0 z-40 w-64 border-l border-[#2A2D36]
             transform transition-transform duration-300 lg:static lg:translate-x-0"
      style="background:#1C1E24"
      :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    >
      <Sidebar />
    </aside>

    <div class="flex min-h-screen min-w-0 flex-1 flex-col" style="background:#14151A">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="min-w-0 flex-1 overflow-x-auto p-4 md:p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Sidebar from '../components/dashboard/sidebar.vue'
import Header from '../components/dashboard/Header.vue'

const route = useRoute()
const isSidebarOpen = ref(false)

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false
  }
)
</script>
