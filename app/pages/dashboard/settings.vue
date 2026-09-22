<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-dash-text">تنظیمات</h1>
      <p class="mt-1 text-sm text-dash-muted">حساب ادمین این نمونه کار</p>
    </div>

    <section class="rounded-2xl border border-dash-border bg-dash-card p-5 sm:p-6">
      <p class="text-xs font-bold text-dash-accent">نمونه کار</p>
      <h2 class="mt-1 text-lg font-bold text-dash-text">Booklett برای پورتفولیو است</h2>
      <p class="mt-2 max-w-lg text-sm leading-relaxed text-dash-muted">
        ورود نمایشی داشبورد برای کارفرماست. مشتری فروشگاه با موبایل ثبت‌نام می‌کند و به این پنل دسترسی ندارد.
      </p>
      <NuxtLink
        to="/"
        class="mt-4 inline-flex rounded-xl bg-dash-accent px-4 py-2 text-sm font-bold text-dash-bg hover:opacity-90"
      >
        رفتن به فروشگاه
      </NuxtLink>
    </section>

    <section class="rounded-2xl border border-dash-border bg-dash-card p-5 sm:p-6">
      <h2 class="text-lg font-bold text-dash-text">حساب فعلی</h2>
      <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-dash-muted">نام</dt>
          <dd class="mt-1 font-bold text-dash-text">{{ auth.user?.name || '—' }}</dd>
        </div>
        <div>
          <dt class="text-dash-muted">نقش</dt>
          <dd class="mt-1 font-bold text-dash-text">{{ roleLabel(auth.user?.role) }}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-dash-muted">ورود</dt>
          <dd class="mt-1 font-mono text-dash-text" dir="ltr">{{ auth.user?.email || '—' }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات',
  layout: 'dashboard',
})

useSeoMeta({
  title: 'تنظیمات',
})

const auth = useAuthStore()

function roleLabel(role?: string) {
  if (role === 'super-admin') return 'سوپرادمین'
  if (role === 'admin') return 'ادمین'
  return 'کاربر'
}
</script>
