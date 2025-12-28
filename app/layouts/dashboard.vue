<template>
  <div class="min-h-screen bg-gray-100 flex">

    <!-- overlay موبایل -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed lg:static z-40 inset-y-0 right-0 w-64
             bg-white shadow
             transform transition-transform duration-300
             lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    >
      <Sidebar />
    </aside>

    <!-- Content -->
    <div class="flex-1 flex flex-col min-h-screen bg-gray-100">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- ⭐ این مهمه -->
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
