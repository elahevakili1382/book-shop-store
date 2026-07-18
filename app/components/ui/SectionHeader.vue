<template>
  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
    <div class="text-right">
      <p v-if="eyebrow" class="text-xs font-bold tracking-[0.18em] text-slate/45 mb-1.5 uppercase">
        {{ eyebrow }}
      </p>
      <h2 class="text-2xl sm:text-3xl font-black text-slate">{{ title }}</h2>
      <p v-if="subtitle" class="text-sm text-slate/55 mt-1.5">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2 self-start sm:self-auto">
      <slot name="actions">
        <NuxtLink
          v-if="linkTo"
          :to="linkTo"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate text-white text-sm font-bold shadow-card hover:opacity-90 transition-opacity"
        >
          {{ linkLabel }}
          <AppIcon icon="mdi:arrow-left" class="w-4 h-4" />
        </NuxtLink>
      </slot>
      <template v-if="showNav">
        <button
          type="button"
          aria-label="قبلی"
          :disabled="!navReady"
          class="rounded-full p-2.5 bg-white border border-slate/10 shadow-card hover:bg-cream transition disabled:opacity-40"
          @click="$emit('prev')"
        >
          <AppIcon icon="mdi:chevron-right" class="w-5 h-5 text-slate" />
        </button>
        <button
          type="button"
          aria-label="بعدی"
          :disabled="!navReady"
          class="rounded-full p-2.5 bg-white border border-slate/10 shadow-card hover:bg-cream transition disabled:opacity-40"
          @click="$emit('next')"
        >
          <AppIcon icon="mdi:chevron-left" class="w-5 h-5 text-slate" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  eyebrow?: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
  showNav?: boolean
  navReady?: boolean
}>()

defineEmits<{ prev: []; next: [] }>()
</script>
