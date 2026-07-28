<template>
  <div class="relative w-full" :class="wrapperClass">
    <AppIcon
      icon="mdi:magnify"
      class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-dash-muted pointer-events-none"
    />
    <input
      :value="modelValue"
      type="search"
      autocomplete="off"
      :placeholder="placeholder"
      class="w-full h-10 pr-9 pl-9 rounded-xl border border-dash-border bg-dash-bg text-dash-text text-sm
             placeholder:text-dash-muted outline-none transition focus:ring-2 focus:ring-dash-accent/40"
      @input="onInput"
    />
    <button
      v-if="modelValue.length"
      type="button"
      class="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded text-dash-muted hover:text-dash-text transition"
      aria-label="پاک کردن جستجو"
      @click="emit('update:modelValue', '')"
    >
      <AppIcon icon="mdi:close" class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    wrapperClass?: string
  }>(),
  {
    placeholder: 'جستجو...',
    wrapperClass: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
