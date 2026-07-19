<template>
  <div v-if="loading" class="text-dash-muted py-8">در حال بارگذاری...</div>
  <div
    v-else
    class="bg-dash-card border border-dash-border rounded-2xl overflow-hidden"
  >
    <table class="w-full text-right">
      <thead class="bg-dash-bg border-b border-dash-border">
        <tr class="text-dash-muted text-sm">
          <th class="p-3 font-medium">نام</th>
          <th class="p-3 font-medium">ایمیل</th>
          <th class="p-3 font-medium">نقش</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="admin in admins"
          :key="admin.id"
          class="border-t border-dash-border/60 text-dash-text hover:bg-dash-bg/80 transition"
        >
          <td class="p-3 font-semibold">{{ admin.name }}</td>
          <td class="p-3 text-dash-muted">{{ admin.email }}</td>
          <td class="p-3 capitalize">
            <span class="rounded-full px-2.5 py-1 text-xs font-medium bg-dash-accent/15 text-dash-accent">
              {{ admin.role }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  admins: Admin[]
  loading: boolean
}>()
</script>
