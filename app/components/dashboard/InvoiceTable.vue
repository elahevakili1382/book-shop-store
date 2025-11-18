<template>
  <div class="bg-white p-6 rounded-2xl shadow-lg">
    <!-- Title -->
    <h2 class="text-2xl font-bold text-gray-700 mb-5">لیست فاکتورها</h2>

    <!-- Loading -->
    <div v-if="invoiceStore.loading" class="flex justify-center py-10">
      <span class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
    </div>

    <!-- Empty State -->
    <div v-else-if="invoiceStore.invoices.length === 0" class="text-center py-10 text-gray-500">
      هیچ فاکتوری یافت نشد.
    </div>

    <!-- Table -->
    <div v-else>
      <table class="w-full text-right border-separate border-spacing-y-3">
        <thead>
          <tr class="text-gray-600 text-lg">
            <th>شماره</th>
            <th>مشتری</th>
            <th>تاریخ</th>
            <th>مبلغ</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>

<tbody>
  <tr
    v-for="invoice in invoiceStore.invoices"
    :key="invoice.id"
    class="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
  >
    <!-- شماره فاکتور -->
    <td class="p-3 font-semibold">
      {{ invoice.number ?? '-' }}
    </td>

    <!-- مشتری -->
    <td class="p-3">
      {{ invoice.customer ?? '-' }}
    </td>

    <!-- تاریخ -->
    <td class="p-3">
      {{ invoice.date ? new Date(invoice.date).toLocaleDateString('fa-IR') : '-' }}
    </td>

    <!-- مبلغ -->
    <td class="p-3 font-bold text-blue-700">
      {{ invoice.total?.toLocaleString() ?? '۰' }} تومان
    </td>

    <!-- وضعیت -->
    <td class="p-3">
      <span
        :class="statusClass(invoice.status)"
        class="px-3 py-1 text-sm rounded-full"
      >
        {{ invoice.status ?? '-' }}
      </span>
    </td>

    <!-- عملیات -->
    <td class="p-3 flex items-center gap-3">
      <button
        class="text-blue-600 hover:text-blue-900"
        @click="edit(invoice)"
      >
        ✏️
      </button>

      <button
        class="text-red-500 hover:text-red-700"
        @click="remove(invoice.id)"
      >
        🗑️
      </button>
    </td>
  </tr>
</tbody>

      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInvoiceStore } from '~/stores/useInvoiceStore'
import { onMounted } from 'vue'

const invoiceStore = useInvoiceStore()

onMounted(() => {
  invoiceStore.fetchInvoices()
})

// وضعیت رنگی حرفه‌ای
const statusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-600'
    case 'canceled':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}

const remove = (id: number) => {
  if (confirm('آیا مطمئن هستید؟')) {
    invoiceStore.deleteInvoice(id)
  }
}

const edit = (invoice: any) => {
  alert('Modal Edit بعداً اضافه می‌کنیم 🔥')
}
</script>

<style scoped>
table th,
table td {
  padding: 12px;
}
</style>
