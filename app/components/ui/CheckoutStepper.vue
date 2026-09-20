<template>
  <ol class="mb-8 flex items-center gap-2 sm:gap-3" aria-label="مراحل سفارش">
    <li
      v-for="(step, index) in steps"
      :key="step.to"
      class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
    >
      <NuxtLink
        :to="step.to"
        :aria-current="step.key === current ? 'step' : undefined"
        class="flex min-w-0 items-center gap-2"
      >
        <span
          :class="[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black',
            step.key === current
              ? 'bg-slate text-white'
              : isDone(index)
                ? 'bg-lime text-slate'
                : 'bg-white text-slate/40 border border-slate/15',
          ]"
        >
          {{ (index + 1).toLocaleString('fa-IR') }}
        </span>
        <span
          :class="[
            'truncate text-xs font-bold sm:text-sm',
            step.key === current ? 'text-slate' : 'text-slate/45',
          ]"
        >
          {{ step.label }}
        </span>
      </NuxtLink>
      <span
        v-if="index < steps.length - 1"
        class="hidden h-px flex-1 bg-slate/15 sm:block"
        aria-hidden="true"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
const props = defineProps<{
  current: 'cart' | 'address' | 'payment'
}>()

const steps = [
  { key: 'cart' as const, label: 'سبد', to: '/cart' },
  { key: 'address' as const, label: 'ارسال', to: '/address' },
  { key: 'payment' as const, label: 'پرداخت', to: '/payment' },
]

function isDone(index: number) {
  const order = ['cart', 'address', 'payment']
  return order.indexOf(props.current) > index
}
</script>
