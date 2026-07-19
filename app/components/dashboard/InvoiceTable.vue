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
    activeTab === tab.status ? tabColor(tab.status) : 'text-dash-muted bg-dash-card border-dash-border hover:bg-dash-border/40'
  ]"      >
        {{ tab.label }}
         <span  class="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full text-dash-bg" 
        :class="countColor(tab.status, activeTab === tab.status)">{{ tab.amount }}
      </span> 
       </button>
    </div>


<!-- Invoice Table -->
<div class="bg-dash-card border border-dash-border p-6 rounded-2xl">
  <h2 class="text-2xl font-bold text-dash-text mb-5">لیست فاکتورها</h2>

  <div v-if="invoiceStore.loading" class="flex justify-center py-10">
    <span class="animate-spin w-8 h-8 border-4 border-dash-accent border-t-transparent rounded-full"></span>
  </div>

  <div v-else-if="filteredInvoices.length === 0" class="text-center py-10 text-dash-muted">
    هیچ فاکتوری یافت نشد.
  </div>

  <div v-else>
    <table class="w-full text-right border-separate border-spacing-y-3 text-dash-text">
      <thead>
        <tr class="text-dash-muted text-base">
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
          class="bg-dash-bg hover:bg-dash-border/40 transition rounded-xl"
        >
          <td class="p-3 font-semibold">{{ invoice.number }}</td>
          <td class="p-3 font-sans">{{ invoice.client }}</td>
          <td class="p-3 text-dash-muted">{{ formatDate(invoice.date) }}</td>
          <td class="p-3 font-bold text-dash-accent">{{ invoice.total.toLocaleString() }} تومان</td>
          <td class="p-3">
            <span :class="statusClass(invoice.status)" class="px-3 py-1 text-sm rounded-full">
              {{ invoice.status }}
            </span>
          </td>

          <td class="p-3 flex items-center gap-3">
            <button @click="openEditModal(invoice)" class="text-dash-accent hover:opacity-80">✏️</button>
            <EditInvoiceModal v-model="editing" :invoice="selected" @saved="onSaved" @error="onError" />
            <ToastContainer/>
            <button class="text-rose-300 hover:text-rose-200" @click="remove(invoice.id)">🗑️</button>
          </td>

          <td class="p-3 text-dash-muted">{{ formatDate(invoice.due) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div class="bg-dash-card border border-dash-border rounded-2xl p-6 w-full max-w-md text-dash-text">
    <h3 class="text-lg font-semibold mb-4">ویرایش فاکتور</h3>

    <form @submit.prevent="submitEditInvoice" class="space-y-4">
      <input v-model="selectedInvoice.client" type="text" placeholder="مشتری" class="w-full border border-dash-border rounded-lg px-3 py-2 bg-dash-bg text-dash-text" required />
      <input v-model="selectedInvoice.total" type="number" placeholder="مبلغ" class="w-full border border-dash-border rounded-lg px-3 py-2 bg-dash-bg text-dash-text" required />
      <select v-model="selectedInvoice.status" class="w-full border border-dash-border rounded-lg px-3 py-2 bg-dash-bg text-dash-text">
        <option value="Paid">پرداخت شده</option>
        <option value="Pending">در انتظار پرداخت </option>
        <option value="Unpaid">پرداخت نشده</option>
      </select>

      <div class="flex justify-end gap-3 mt-4">
        <button type="button" class="px-4 py-2 bg-dash-border rounded-lg text-dash-text" @click="closeEditModal">انصراف</button>
        <button type="submit" class="px-4 py-2 bg-dash-accent text-dash-bg font-bold rounded-lg hover:opacity-90">ذخیره</button>
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
import { formatDate } from '../../utils/formatDate'
import type { Invoice } from '../../stores/useInvoiceStore'


const invoiceStore = useInvoiceStore()
const toast = useMyToast()

const fetchInvoices = async() =>{
  invoiceStore.loading = true
  try{
    const data = await $fetch<Invoice[]>("/api/invoices")
    console.log('Fetched:',data);
    invoiceStore.invoices = data
  }catch(err){
    console.error('Error fetching invoices:', err)
  }finally{
    invoiceStore.loading = false
  }
}
onMounted(() => {
  fetchInvoices() 
})

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
    case 'Paid': return 'bg-dash-accent2/15 text-dash-accent2'
    case 'Pending': return 'bg-amber-400/15 text-amber-300'
    case 'Unpaid': return 'bg-rose-400/15 text-rose-300'
    default: return 'bg-dash-border text-dash-muted'
  }
}
const tabColor = (status: string) => {
  switch(status) {
    case 'All Invoice': return 'bg-dash-accent/15 text-dash-accent border-dash-accent/40'
    case 'Paid': return 'bg-dash-accent2/15 text-dash-accent2 border-dash-accent2/40'
    case 'Pending': return 'bg-amber-400/15 text-amber-300 border-amber-400/40'
    case 'Unpaid': return 'bg-rose-400/15 text-rose-300 border-rose-400/40'
    default: return 'bg-dash-card text-dash-muted border-dash-border'
  }
}

const countColor = (status: string, isActive: boolean) => {
  switch(status) {
    case 'Paid': return isActive ? 'bg-dash-accent2' : 'bg-dash-accent2/50'
    case 'Pending': return isActive ? 'bg-amber-400' : 'bg-amber-400/50'
    case 'Unpaid': return isActive ? 'bg-rose-400' : 'bg-rose-400/50'
    default: return isActive ? 'bg-dash-accent' : 'bg-dash-muted'
  }
}


const tabsWithCount = computed(() =>{
  return tabs.map(tab => {
    if(tab.status === 'all') return{...tab,amount:invoiceStore.invoices.length}
    return{...tab, amount:invoiceStore.invoices.filter(inv => inv.status === tab.status).length }
  })
})


const remove = (id: string) => { if (confirm('آیا مطمئن هستید؟')) invoiceStore.deleteInvoice(id) }
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
  background: #DCF763;
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
  background: #2A2D36;
  border-radius: 2px;
  transition: all 0.3s ease; /* انیمیشن روی تغییرات */
}

/* هاور th */
thead th:hover {
  transform: translateY(-1px) scale(1.03);
  color: #DCF763;
}

/* خط زیر هنگام هاور */
thead th:hover::after {
  width: 100%;
  left: 0;
  background: #DCF763;
}


</style>
