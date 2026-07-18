<template>
  <ClientOnly>
    <motion.div
      :initial="initial"
      :while-in-view="animate"
      :viewport="{ once: true, amount: 0.15 }"
      :transition="{ duration: 0.9, delay: props.delay, ease: [0.22, 1, 0.36, 1] }"
    >
      <slot />
    </motion.div>
    <template #fallback>
      <div><slot /></div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
  }>(),
  { delay: 0, direction: 'up' }
)

const initial = computed(() => {
  if (props.direction === 'left') return { opacity: 0, x: 40 }
  if (props.direction === 'right') return { opacity: 0, x: -40 }
  if (props.direction === 'down') return { opacity: 0, y: -32 }
  return { opacity: 0, y: 32 }
})

const animate = { opacity: 1, x: 0, y: 0 }
</script>
