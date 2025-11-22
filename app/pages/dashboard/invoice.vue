<template>
  <div class="space-y-6">
    <InvoiceTable />
  </div>
</template>

<script setup>
import InvoiceTable from '~/components/dashboard/InvoiceTable.vue';
definePageMeta({
  title: "فاکتورها",
  layout: "dashboard"
})
</script>
