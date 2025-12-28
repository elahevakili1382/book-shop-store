<template>
  <div>
    <!-- Tabs -->
    <div class="flex gap-4 overflow-x-auto pb-2 mb-6">
      <button
        v-for="tab in tabsWithCount"
        :key="tab.status"
        @click="activeTab = tab.status"
  :class="[
    'flex justify-center items-center px-5 py-2 gap-1 rounded-2xl text-sm font-semibold border transition',
    activeTab === tab.status ? tabColor(tab.status) : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
  ]"      >
        {{ tab.label }}
         <span  class="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full text-white" 
        :class="countColor(tab.status, activeTab === tab.status)">{{ tab.amount }}
      </span> 
       </button>
    </div>


<!-- Invoice Table -->
<div class="bg-white p-6 rounded-2xl shadow-lg">
  <h2 class="text-2xl font-bold text-gray-700 mb-5">لیست فاکتورها</h2>

  <div v-if="invoiceStore.loading" class="flex justify-center py-10">
    <span class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
  </div>

  <div v-else-if="filteredInvoices.length === 0" class="text-center py-10 text-gray-500">
    هیچ فاکتوری یافت نشد.
  </div>

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
          <th>تاریخ پایان</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="invoice in filteredInvoices"
          :key="invoice.id"
          class="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
        >
          <td class="p-3 font-semibold">{{ invoice.number }}</td>
          <td class="p-3 font-sans">{{ invoice.client }}</td>
          <td class="p-3">{{ formatDate(invoice.date) }}</td>
          <td class="p-3 font-bold text-blue-700">{{ invoice.total.toLocaleString() }} تومان</td>
          <td class="p-3">
            <span :class="statusClass(invoice.status)" class="px-3 py-1 text-sm rounded-full">
              {{ invoice.status }}
            </span>
          </td>

          <td class="p-3 flex items-center gap-3">
            <button @click="openEditModal(invoice)" class="text-blue-600 hover:text-blue-900">✏️</button>
            <EditInvoiceModal v-model="editing" :invoice="selected" @saved="onSaved" @error="onError" />
            <ToastContainer/>
            <button class="text-red-500 hover:text-red-700" @click="remove(invoice.id)">🗑️</button>
          </td>

          <td class="p-3">{{ formatDate(invoice.due) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showEditModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white rounded-2xl p-6 w-full max-w-md">
    <h3 class="text-lg font-semibold mb-4">ویرایش فاکتور</h3>

    <form @submit.prevent="submitEditInvoice" class="space-y-4">
      <input v-model="selectedInvoice.client" type="text" placeholder="مشتری" class="w-full border rounded px-3 py-2" required />
      <input v-model="selectedInvoice.total" type="number" placeholder="مبلغ" class="w-full border rounded px-3 py-2" required />
      <select v-model="selectedInvoice.status" class="w-full border rounded px-3 py-2">
        <option value="Paid">پرداخت شده</option>
        <option value="Pending">در انتظار پرداخت </option>
        <option value="Unpaid">پرداخت نشده</option>
      </select>

      <div class="flex justify-end gap-3 mt-4">
        <button type="button" class="px-4 py-2 bg-gray-200 rounded" @click="closeEditModal">انصراف</button>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">ذخیره</button>
      </div>
    </form>
  </div>
</div>

  </div>
</div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInvoiceStore } from '../../stores/useInvoiceStore'
import ToastContainer from '../../components/ToastContainer.vue'
import { useMyToast } from '../../composables/usemyToast'

const invoiceStore = useInvoiceStore()
const toast = useMyToast()
onMounted(() => invoiceStore.fetchInvoices())

// Tabs
const tabs = [
  { status: 'all', label: 'همه فاکتورها' },
  { status: 'Paid', label: 'پرداخت موفق' },
  { status: 'Pending', label: 'در انتظار پرداخت' },
  { status: 'Unpaid', label: 'پرداخت نشده' },
]

const activeTab = ref('all')

// Modal
const editing = ref(false)
const selected = ref<any | null>(null)
const showEditModal = ref(false)
const selectedInvoice = ref<any | null>(null)



  const openEditModal = (invoice: any) => {
  selectedInvoice.value = { ...invoice } // کپی برای فرم
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedInvoice.value = null
}

const submitEditInvoice = () => {
  if (!selectedInvoice.value) return

  const index = invoiceStore.invoices.findIndex(i => i.id === selectedInvoice.value!.id)
  if (index !== -1) {
    invoiceStore.invoices[index] = { ...selectedInvoice.value } // ویرایش در استور
  }

  closeEditModal()
}


const onSaved = (updated: any) => toast.add({ type: 'success', message: 'فاکتور با موفقیت ذخیره شد', title: 'ذخیره' })
const onError = (msg: string) => toast.add({ type: 'error', message: msg || 'خطا در ذخیره', title: 'خطا' })

// Filtered invoices by active tab
const filteredInvoices = computed(() => {
  if (activeTab.value === 'all') return invoiceStore.invoices
  return invoiceStore.invoices.filter(inv => inv.status === activeTab.value)
})

// Helpers
const statusClass = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-700'
    case 'Pending': return 'bg-yellow-100 text-yellow-600'
    case 'Unpaid': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-200 text-gray-700'
  }
}
const tabColor = (status: string) => {
  switch(status) {
        case 'All Invoice': return 'bg-white text-green-700 border-green-300'

    case 'Paid': return 'bg-green-100 text-green-700 border-green-300'
    case 'Pending': return 'bg-yellow-100 text-yellow-600 border-yellow-300'
    case 'Unpaid': return 'bg-red-100 text-red-600 border-red-300'
    default: return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const countColor = (status: string, isActive: boolean) => {
  switch(status) {
    case 'Paid': return isActive ? 'bg-green-700' : 'bg-green-300'
    case 'Pending': return isActive ? 'bg-yellow-600' : 'bg-yellow-200'
    case 'Unpaid': return isActive ? 'bg-red-600' : 'bg-red-300'
    default: return isActive ? 'bg-gray-700' : 'bg-gray-300'
  }
}


const tabsWithCount = computed(() =>{
  return tabs.map(tab => {
    if(tab.status === 'all') return{...tab,amount:invoiceStore.invoices.length}
    return{...tab, amount:invoiceStore.invoices.filter(inv => inv.status === tab.status).length }
  })
})


const remove = (id: string) => { if (confirm('آیا مطمئن هستید؟')) invoiceStore.deleteInvoice(id) }
const formatDate = (value?: string) => { if(!value) return '-'; const d = new Date(value); return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fa-IR') }
</script>

<style scoped  lang="postcss">
.badge-tab {
  @apply px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition;
}
.badge-tab-active {
  @apply px-4 py-2 rounded-lg text-sm bg-green-100 text-green-700 font-semibold border border-green-300;
}
table th, table td { padding: 12px; }
/* ردیف‌ها */
tbody tr {
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

tbody tr:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

tbody tr::after {
  opacity: 0;
  content: "";
  position: absolute;
  height: 2px;
  width: 0;
  bottom: 0;
  right: 0;
  background: #4e5dff;
  border-radius: 2px;
  transition: width 0.25s ease;
}

tbody tr:hover::after {
opacity: 1;
}
/* هدر جدول */
thead th {
  position: relative;
  cursor: pointer;
  transition: color 0.25s ease, transform 0.25s ease;
}

/* خط زیر th به صورت دیفالت (طوسی یا آبی ملایم) */
thead th::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 60%;           /* حالت عادی طول خط */
  bottom: 0;
  left: 20%;            /* وسط کردن خط */
  background: #cbd5e1;  /* رنگ طوسی ملایم */
  border-radius: 2px;
  transition: all 0.3s ease; /* انیمیشن روی تغییرات */
}

/* هاور th */
thead th:hover {
  transform: translateY(-1px) scale(1.03);
  color: #4e5dff;
}

/* خط زیر هنگام هاور */
thead th:hover::after {
  width: 100%;
  left: 0;
  background: #4e5dff; /* رنگ آبی هنگام هاور */
}


</style>
