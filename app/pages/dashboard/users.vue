<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <button
        type="button"
        class="min-h-11 flex-1 rounded-2xl bg-dash-accent px-4 text-sm font-bold text-dash-bg"
        @click="openCreate"
      >
        ثبت مشتری جدید
      </button>
      <button
        type="button"
        class="min-h-11 flex-1 rounded-2xl border border-dash-border bg-dash-card px-4 text-sm font-bold text-dash-text"
        :disabled="!customers.length"
        @click="downloadExcel"
      >
        دانلود اکسل
      </button>
    </div>

    <p v-if="pending" class="py-12 text-center text-sm text-dash-muted">در حال بارگذاری...</p>
    <p v-else-if="error" class="py-12 text-center text-sm text-rose-300">خطا در دریافت مشتری‌ها</p>

    <template v-else>
      <div class="grid grid-cols-3 gap-2 px-1 text-[11px] font-bold text-dash-muted">
        <p>نام و نام خانوادگی</p>
        <p>استان و شهر</p>
        <p class="text-left" dir="ltr">شماره تماس</p>
      </div>

      <p v-if="!customers.length" class="py-12 text-center text-sm text-dash-muted">مشتری ثبت نشده است</p>

      <ul v-else class="space-y-2">
        <li v-for="user in customers" :key="user.id || user._id">
          <button
            type="button"
            class="grid w-full grid-cols-3 items-center gap-2 rounded-2xl border border-dash-border bg-dash-card px-3 py-3.5 text-right"
            @click="openDetail(user)"
          >
            <span class="min-w-0">
              <span class="block truncate text-sm font-bold text-dash-text">{{ splitName(user.name).first }}</span>
              <span class="mt-0.5 block truncate text-[11px] text-dash-muted">{{ splitName(user.name).last || '—' }}</span>
            </span>
            <span class="min-w-0">
              <span class="block truncate text-sm font-bold text-dash-text">{{ placeOf(user).primary }}</span>
              <span class="mt-0.5 block truncate text-[11px] text-dash-muted">{{ placeOf(user).secondary }}</span>
            </span>
            <span class="min-w-0 text-left font-mono text-xs font-bold text-dash-text sm:text-sm" dir="ltr">
              {{ contactOf(user) }}
            </span>
          </button>
        </li>
      </ul>
    </template>

    <Teleport to="body">
      <div
        v-if="sheet"
        class="fixed inset-0 z-[90] bg-black/55"
        @click="closeSheet"
      >
        <div
          class="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-dash-border bg-dash-card px-5 pt-3 text-dash-text"
          style="padding-bottom: max(1.25rem, env(safe-area-inset-bottom))"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-dash-border" />

          <template v-if="sheet === 'detail' && selected">
            <h2 class="text-lg font-black">{{ selected.name }}</h2>
            <p class="mt-1 text-sm text-dash-muted">{{ roleLabel(selected.role) }}</p>

            <dl class="mt-5 space-y-3 text-sm">
              <div class="flex items-start justify-between gap-3">
                <dt class="text-dash-muted">موبایل</dt>
                <dd class="font-mono font-bold" dir="ltr">{{ contactOf(selected) }}</dd>
              </div>
              <div class="flex items-start justify-between gap-3">
                <dt class="text-dash-muted">استان</dt>
                <dd class="font-bold">{{ selected.province || '—' }}</dd>
              </div>
              <div class="flex items-start justify-between gap-3">
                <dt class="text-dash-muted">شهر</dt>
                <dd class="font-bold">{{ selected.city || '—' }}</dd>
              </div>
              <div v-if="selected.address" class="flex items-start justify-between gap-3">
                <dt class="text-dash-muted">آدرس</dt>
                <dd class="max-w-[65%] text-left font-bold leading-relaxed">{{ selected.address }}</dd>
              </div>
              <div class="flex items-start justify-between gap-3">
                <dt class="text-dash-muted">عضویت</dt>
                <dd>{{ formatDate(selected.createdAt) }}</dd>
              </div>
            </dl>

            <div class="mt-6 grid grid-cols-2 gap-2">
              <a
                v-if="contactOf(selected) !== '—'"
                :href="`tel:${contactOf(selected)}`"
                class="flex min-h-11 items-center justify-center rounded-2xl bg-dash-accent text-sm font-bold text-dash-bg"
              >
                تماس
              </a>
              <button
                type="button"
                class="flex min-h-11 items-center justify-center rounded-2xl border border-dash-border text-sm font-bold"
                @click="copyPhone"
              >
                کپی شماره
              </button>
              <NuxtLink
                :to="{ path: '/dashboard/orders', query: { q: selected.name } }"
                class="col-span-2 flex min-h-11 items-center justify-center rounded-2xl border border-dash-border text-sm font-bold"
                @click="closeSheet"
              >
                سفارش‌های این مشتری
              </NuxtLink>
            </div>
          </template>

          <form v-else-if="sheet === 'create'" class="space-y-3" @submit.prevent="submitCreate">
            <h2 class="text-lg font-black">ثبت مشتری جدید</h2>
            <p v-if="formError" class="text-sm text-rose-300">{{ formError }}</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="block text-xs font-bold text-dash-muted">
                نام
                <input v-model="form.firstName" required class="mt-1 h-11 w-full rounded-xl border border-dash-border bg-dash-bg px-3 text-sm text-dash-text" />
              </label>
              <label class="block text-xs font-bold text-dash-muted">
                نام خانوادگی
                <input v-model="form.lastName" required class="mt-1 h-11 w-full rounded-xl border border-dash-border bg-dash-bg px-3 text-sm text-dash-text" />
              </label>
            </div>
            <label class="block text-xs font-bold text-dash-muted">
              شماره تماس
              <input
                v-model="form.phone"
                type="tel"
                required
                dir="ltr"
                inputmode="numeric"
                placeholder="09121234567"
                class="mt-1 h-11 w-full rounded-xl border border-dash-border bg-dash-bg px-3 text-sm text-dash-text"
              />
            </label>
            <label class="block text-xs font-bold text-dash-muted">
              استان
              <select v-model="form.province" class="mt-1 h-11 w-full rounded-xl border border-dash-border bg-dash-bg px-3 text-sm text-dash-text">
                <option value="">انتخاب استان</option>
                <option v-for="p in IRAN_PROVINCES" :key="p" :value="p">{{ p }}</option>
              </select>
            </label>
            <label class="block text-xs font-bold text-dash-muted">
              شهر
              <input v-model="form.city" class="mt-1 h-11 w-full rounded-xl border border-dash-border bg-dash-bg px-3 text-sm text-dash-text" />
            </label>
            <label class="block text-xs font-bold text-dash-muted">
              آدرس
              <textarea v-model="form.address" rows="2" class="mt-1 w-full rounded-xl border border-dash-border bg-dash-bg px-3 py-2 text-sm text-dash-text" />
            </label>
            <button
              type="submit"
              :disabled="saving"
              class="min-h-11 w-full rounded-2xl bg-dash-accent text-sm font-bold text-dash-bg disabled:opacity-50"
            >
              {{ saving ? 'در حال ثبت...' : 'ثبت مشتری' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../../../types/dashboard'
import { isPlaceholderEmail, isIranMobile, toEnglishDigits } from '../../utils/digits'
import { IRAN_PROVINCES } from '../../utils/iranProvinces'

definePageMeta({
  title: 'مشتریان',
  layout: 'dashboard',
})

useSeoMeta({
  title: 'مشتریان',
})

type Customer = User & { phone?: string; city?: string; province?: string; address?: string }

const toast = useToast()
const { data, pending, error, refresh } = await useFetch<Customer[]>('/api/users')

const sheet = ref<'detail' | 'create' | null>(null)
const selected = ref<Customer | null>(null)
const saving = ref(false)
const formError = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  province: '',
  city: '',
  address: '',
})

const customers = computed(() =>
  (data.value ?? []).filter((user) => user.role !== 'admin' && user.role !== 'super-admin')
)

function splitName(name?: string) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  return {
    first: parts[0] || '—',
    last: parts.slice(1).join(' '),
  }
}

function placeOf(user: Customer) {
  if (user.province && user.city) {
    return { primary: user.province, secondary: user.city }
  }
  if (user.province) return { primary: user.province, secondary: '—' }
  if (user.city) return { primary: user.city, secondary: '—' }
  return { primary: '—', secondary: '—' }
}

function contactOf(user: Customer) {
  if (user.phone) return toEnglishDigits(user.phone)
  if (isPlaceholderEmail(user.email)) return '—'
  return '—'
}

function roleLabel(role?: string) {
  if (role === 'super-admin') return 'سوپرادمین'
  if (role === 'admin') return 'ادمین'
  return 'مشتری'
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fa-IR')
}

function openDetail(user: Customer) {
  selected.value = user
  sheet.value = 'detail'
}

function openCreate() {
  formError.value = ''
  form.firstName = ''
  form.lastName = ''
  form.phone = ''
  form.province = ''
  form.city = ''
  form.address = ''
  sheet.value = 'create'
}

function closeSheet() {
  sheet.value = null
  selected.value = null
}

async function copyPhone() {
  if (!selected.value) return
  const phone = contactOf(selected.value)
  if (phone === '—') return
  try {
    await navigator.clipboard.writeText(phone)
    toast.success({ message: 'شماره کپی شد', position: 'topRight' })
  } catch {
    toast.error('کپی نشد')
  }
}

function csvCell(value: string) {
  const text = String(value || '').replace(/"/g, '""')
  return `"${text}"`
}

function downloadExcel() {
  const rows = [
    ['نام', 'نام خانوادگی', 'استان', 'شهر', 'موبایل', 'آدرس'],
    ...customers.value.map((user) => {
      const { first, last } = splitName(user.name)
      return [first, last, user.province || '', user.city || '', contactOf(user), user.address || '']
    }),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\n')}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'moshtarian-booklett.csv'
  link.click()
  URL.revokeObjectURL(url)
}

async function submitCreate() {
  formError.value = ''
  const phone = toEnglishDigits(form.phone)
  if (!isIranMobile(phone)) {
    formError.value = 'موبایل را با ۰۹ و ۱۱ رقم وارد کن'
    return
  }
  saving.value = true
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone,
        province: form.province,
        city: form.city.trim(),
        address: form.address.trim(),
      },
    })
    toast.success({ message: 'مشتری ثبت شد', position: 'topRight' })
    closeSheet()
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || err?.data?.message || 'ثبت نشد'
  } finally {
    saving.value = false
  }
}
</script>
