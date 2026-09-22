<template>
  <label class="block text-sm font-bold text-slate">
    {{ label }}
    <div class="relative mt-1.5">
      <AppIcon
        icon="mdi:lock-outline"
        class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate/35"
      />
      <input
        v-model="model"
        :type="showPassword ? 'text' : 'password'"
        required
        minlength="6"
        :autocomplete="autocomplete"
        class="w-full rounded-2xl border border-slate/10 bg-white py-3 pr-11 pl-12 text-sm outline-none focus:ring-2 focus:ring-lime/60"
        :placeholder="placeholder"
      />
      <button
        type="button"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate"
        :aria-label="showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'"
        @click="showPassword = !showPassword"
      >
        <AppIcon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="h-5 w-5" />
      </button>
    </div>
  </label>

  <div v-if="showStrength && model" class="space-y-2">
    <div class="flex items-center gap-2">
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate/10">
        <div
          class="h-full rounded-full bg-slate transition-all"
          :style="{ width: `${(passwordScore / 3) * 100}%` }"
        />
      </div>
      <span class="text-[11px] font-bold text-slate/50">{{ passwordLabel }}</span>
    </div>
    <p v-if="passwordScore < 3" class="text-[11px] text-slate/40">
      بهتر است حرف و عدد با هم باشند.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps<{
  label: string
  placeholder: string
  autocomplete: string
  showStrength?: boolean
}>()

const showPassword = ref(false)
const model = defineModel<string>({ default: '' })

const passwordScore = computed(() => {
  const p = model.value || ''
  let score = 0
  if (p.length >= 6) score++
  if (/[A-Za-zآ-ی]/.test(p)) score++
  if (/\d/.test(p)) score++
  return score
})

const passwordLabel = computed(() => {
  if (passwordScore.value <= 1) return 'ضعیف'
  if (passwordScore.value === 2) return 'متوسط'
  return 'خوب'
})
</script>
