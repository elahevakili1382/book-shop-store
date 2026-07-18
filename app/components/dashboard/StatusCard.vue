<template>
  <div class="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-1 min-w-[180px]">
    <p class="text-gray-500 text-sm">{{ title }}</p>
    <h2 class="text-2xl font-semibold text-gray-800">{{ value }}</h2>

    <p 
      class="text-sm font-medium"
      :class="percent.includes('+') ? 'text-green-600' : 'text-red-600'"
    >
      {{ percent }} 
      <span class="text-gray-500">From last week</span>
    </p>
  </div>
</template>

<script setup>
defineProps(["title", "value", "percent"]);
</script>
