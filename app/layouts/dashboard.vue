<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="p-6 space-y-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from '~/components/dashboard/sidebar.vue';
import Header from '~/components/dashboard/Header.vue';
</script>