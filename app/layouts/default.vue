<script setup lang="ts">
  import Header from '../components/Header.vue';
  import Footer from '../components/Footer.vue';
  import BottomNavBar from '../components/ui/BottomNavBar.vue';
</script>

<template>
  <div class="overflow-x-hidden font-sans">
    <Header />
    <main>
    <NuxtPage />
    </main>
    <Footer />
    <ClientOnly>
      <BottomNavBar sticky-bottom />
    </ClientOnly>
  </div>
</template>
