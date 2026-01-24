<template>
        <DashboardBreadcrumb :items="['داشبورد', 'فاکتور ها']"/>

                <h1 class="m-5 font-semibold text-black text-2xl">مدیریت فاکتور ها </h1>
  <div class="space-y-6">
    <InvoiceTable />
  </div>
</template>

<script setup>
import InvoiceTable from '../../components/dashboard/InvoiceTable.vue';
definePageMeta({
  title: "فاکتورها",
  layout: "dashboard",

})
</script>
