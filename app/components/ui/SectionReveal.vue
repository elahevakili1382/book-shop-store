<template>
  <ClientOnly>
    <motion.div
      :initial="skipMotion ? false : initial"
      :while-in-view="skipMotion ? false : animate"
      :viewport="{ once: true, amount: 0.15 }"
      :transition="{ duration: 0.9, delay: props.delay, ease: [0.22, 1, 0.36, 1] }"
    >
      <slot />
    </motion.div>
    <template #fallback>
      <div class="min-h-[12rem]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
  }>(),
  { delay: 0, direction: 'up' }
)

const route = useRoute()
const reduceMotion = ref(false)

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const skipMotion = computed(
  () => reduceMotion.value || route.query.shot === '1' || route.query.shot === 'true',
)

const initial = computed(() => {
  if (props.direction === 'left') return { opacity: 0, x: 40 }
  if (props.direction === 'right') return { opacity: 0, x: -40 }
  if (props.direction === 'down') return { opacity: 0, y: -32 }
  return { opacity: 0, y: 32 }
})

const animate = { opacity: 1, x: 0, y: 0 }
</script>
