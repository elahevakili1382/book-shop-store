<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-dash-text">کاربران</h1>

    <p v-if="pending" class="text-dash-muted">در حال بارگذاری...</p>
    <p v-else-if="error" class="text-rose-300">خطا در دریافت کاربران</p>

    <div v-else class="overflow-x-auto rounded-2xl border border-dash-border bg-dash-card">
      <table class="w-full min-w-[520px] text-right text-sm">
        <thead>
          <tr class="border-b border-dash-border text-dash-muted">
            <th class="p-3 font-medium">نام</th>
            <th class="p-3 font-medium">ایمیل</th>
            <th class="p-3 font-medium">نقش</th>
            <th class="p-3 font-medium">تاریخ عضویت</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id || user._id" class="border-b border-dash-border/60 last:border-0">
            <td class="p-3 font-semibold text-dash-text">{{ user.name }}</td>
            <td class="p-3 text-dash-muted">{{ user.email }}</td>
            <td class="p-3">
              <span class="rounded-full bg-dash-accent/15 px-2.5 py-1 text-xs font-medium text-dash-accent">
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td class="p-3 text-dash-muted">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!users.length" class="py-10 text-center text-sm text-dash-muted">کاربری ثبت نشده است</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../../../types/dashboard'

definePageMeta({
  title: 'کاربران',
  layout: 'dashboard',
})

const { data, pending, error } = await useFetch<User[]>('/api/users')

const users = computed(() => data.value ?? [])

function roleLabel(role?: string) {
  if (role === 'super-admin') return 'سوپرادمین'
  if (role === 'admin') return 'ادمین'
  return 'کاربر'
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fa-IR')
}
</script>
