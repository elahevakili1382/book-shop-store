<template>
  <div class="space-y-6">
    <InvoiceFilters />
    <InvoiceTable />
  </div>
</template>

<script setup>
import InvoiceFilters from '~/components/dashboard/InvoiceFilters.vue';
import InvoiceTable from '~/components/dashboard/InvoiceTable.vue';
definePageMeta({
  title: "فاکتورها",
  layout: "dashboard"
})
</script>
