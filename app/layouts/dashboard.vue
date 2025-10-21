<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar fixed -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 flex flex-col pr-[1rem] pl-[1rem] pt-[1rem]"> <!-- 16rem Sidebar + 2rem فاصله -->
      <Header />

      <main class="p-6">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/dashboard/sidebar.vue';
import Header from '~/components/dashboard/Header.vue';
</script>
