<template>
  <header class="sticky top-0 z-20 border-b border-dash-border bg-dash-bg/90 backdrop-blur-md">
    <div class="flex items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 lg:px-8">
      <button
        type="button"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-dash-text lg:hidden"
        aria-label="منوی بیشتر"
        @click="$emit('toggle-sidebar')"
      >
        <AppIcon icon="mdi:menu" class="h-5 w-5" />
      </button>

      <div class="min-w-0 flex-1">
        <h1 class="truncate text-base font-black text-dash-text sm:text-lg">
          {{ pageTitle }}
        </h1>
      </div>

      <button
        type="button"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-dash-muted hover:text-dash-text md:hidden"
        aria-label="جستجوی کتاب"
        @click="searchOpen = !searchOpen"
      >
        <AppIcon icon="mdi:magnify" class="h-5 w-5" />
      </button>

      <form class="relative hidden min-w-0 md:block md:w-56" @submit.prevent="onSubmit">
        <AppIcon
          icon="mdi:magnify"
          class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted"
        />
        <input
          v-model="query"
          type="search"
          name="dashboard-search"
          autocomplete="off"
          placeholder="جستجوی کتاب"
          class="h-10 w-full rounded-xl border border-dash-border bg-dash-card pr-9 pl-3 text-sm text-dash-text outline-none placeholder:text-dash-muted focus:ring-2 focus:ring-dash-accent/50"
        />
      </form>

      <NuxtLink
        to="/"
        class="flex h-11 shrink-0 items-center rounded-xl px-3 text-xs font-bold text-dash-muted hover:bg-dash-card hover:text-dash-text"
      >
        فروشگاه
      </NuxtLink>
    </div>

    <form v-if="searchOpen" class="border-t border-dash-border px-4 py-2 md:hidden" @submit.prevent="onSubmit">
      <input
        v-model="query"
        type="search"
        autocomplete="off"
        placeholder="جستجوی کتاب"
        class="h-11 w-full rounded-xl border border-dash-border bg-dash-card px-3 text-sm text-dash-text outline-none placeholder:text-dash-muted"
      />
    </form>
  </header>
</template>

<script setup lang="ts">
import { useDashboardSearch } from '../../composables/useDashboardSearch'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const { query } = useDashboardSearch()
const searchOpen = ref(false)

const pageTitle = computed(() => {
  const title = route.meta.title
  return typeof title === 'string' && title ? title : 'داشبورد'
})

function onSubmit() {
  const q = query.value.trim()
  if (!q) return
  searchOpen.value = false
  if (route.path !== '/dashboard/products') {
    return navigateTo({ path: '/dashboard/products', query: { q } })
  }
}
</script>
