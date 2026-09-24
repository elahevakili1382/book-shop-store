<template>
  <div class="fixed top-[4.75rem] inset-x-3 z-[120] flex flex-col items-stretch gap-3 sm:inset-x-auto sm:start-4 sm:w-[320px]">
    <transition-group name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="min-w-[250px] max-w-[320px] px-4 py-3 rounded-xl shadow-lg text-white flex items-start gap-3"
        :class="bg(t.type)"
      >
        <span class="text-xl">{{ icon(t.type) }}</span>

        <div class="flex-1">
          <p class="font-bold text-sm">{{ t.title }}</p>
          <p class="text-sm opacity-90">{{ t.message }}</p>
        </div>

        <button
          class="text-white text-lg opacity-80 hover:opacity-100"
          @click="remove(t.id)"
        >
          ✖
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useMyToast()

const bg = (type: string) => {
  return {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  }[type] || 'bg-gray-700'
}

const icon = (type: string) => {
  return {
    success: '✔️',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }[type] || '🔔'
}
</script>

<style>
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>
