<template>
  <div class="flex gap-4 overflow-x-auto pb-2 mb-6">
    <button class="badge-tab-active">All Invoice 7000</button>
    <button class="badge-tab">Paid 5000</button>
    <button class="badge-tab">Pending 1400</button>
    <button class="badge-tab">Unpaid 600</button>
  </div>
</template>

<style scoped lang="postcss">
.badge-tab {
  @apply px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm
         hover:bg-gray-200 transition;
}

.badge-tab-active {
  @apply px-4 py-2 rounded-lg text-sm bg-green-100 text-green-700
         font-semibold border border-green-300;
}
</style>
