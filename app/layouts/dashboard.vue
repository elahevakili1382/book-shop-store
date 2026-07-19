<template>
  <div class="min-h-screen flex text-[#F5F2EB]" style="background:#14151A">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <aside
      class="fixed lg:static z-40 inset-y-0 right-0 w-64
             border-l border-[#2A2D36]
             transform transition-transform duration-300
             lg:translate-x-0"
      style="background:#1C1E24"
      :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    >
      <Sidebar />
    </aside>

    <div class="flex-1 flex flex-col min-h-screen min-w-0" style="background:#14151A">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="flex-1 p-4 md:p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/dashboard/sidebar.vue'
import Header from '../components/dashboard/Header.vue'

const isSidebarOpen = ref(false)
</script>
