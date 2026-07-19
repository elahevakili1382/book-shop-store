<template>
  <nav class="text-sm text-dash-muted flex items-center gap-2 mb-4">
    <template v-for="(item, index) in items" :key="index">
      <span
        :class="[
          index === items.length - 1
            ? 'text-dash-text font-semibold'
            : 'hover:text-dash-accent cursor-pointer transition-colors',
        ]"
      >
        {{ item }}
      </span>
      <span v-if="index !== items.length - 1" class="text-dash-border">/</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>
