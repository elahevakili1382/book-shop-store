<template>
  <div>
    <!-- Tabs -->
    <div class="flex gap-4 overflow-x-auto pb-2 mb-6">
      <button v-for="tab in tabsWithCount" :key="tab.status" @click="activeTab = tab.status" :class="[
        'flex justify-center items-center px-5 py-2 gap-1 rounded-2xl text-sm font-semibold border transition',
        activeTab === tab.status ? tabColor(tab.status) : 'text-dash-muted bg-dash-card border-dash-border hover:bg-dash-border/40'
      ]">
        {{ tab.label }}
        <span class="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full text-dash-bg"
          :class="countColor(tab.status, activeTab === tab.status)">{{ tab.amount }}
        </span>
      </button>
    </div>


    <!-- Invoice Table -->
    <div class="bg-dash-card border border-dash-border p-6 rounded-2xl">
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5"
      >
        <h2 class="text-2xl font-bold text-dash-text shrink-0">لیست فاکتورها</h2>
        <DashboardListSearch
          v-model="searchTerm"
          placeholder="جستجو: شماره، مشتری..."
          wrapper-class="w-full sm:max-w-xs sm:ms-auto"
        />
      </div>

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
            <tr v-for="invoice in filteredInvoices" :key="invoice.id"
              class="bg-dash-bg hover:bg-dash-border/40 transition rounded-xl">
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
              <input v-model="selectedInvoice.client" type="text" placeholder="مشتری"
                class="w-full border border-dash-border rounded-lg px-3 py-2 bg-dash-bg text-dash-text" required />
              <input v-model="selectedInvoice.total" type="number" placeholder="مبلغ"
                class="w-full border border-dash-border rounded-lg px-3 py-2 bg-dash-bg text-dash-text" required />
              <select v-model="selectedInvoice.status"
                class="w-full border border-dash-border rounded-lg px-3 py-2 bg-dash-bg text-dash-text">
                <option value="paid">پرداخت شده</option>
                <option value="pending">در انتظار پرداخت </option>
                <option value="unpaid">پرداخت نشده</option>
              </select>

              <div class="flex justify-end gap-3 mt-4">
                <button type="button" class="px-4 py-2 bg-dash-border rounded-lg text-dash-text"
                  @click="closeEditModal">انصراف</button>
                <button type="submit"
                  class="px-4 py-2 bg-dash-accent text-dash-bg font-bold rounded-lg hover:opacity-90">ذخیره</button>
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
import { useInvoiceStore, type Invoice } from '../../stores/useInvoiceStore'
import { formatDate } from '../../utils/formatDate'


const invoiceStore = useInvoiceStore()
const searchTerm = ref('')

onMounted(() => {
  invoiceStore.fetchInvoices()
})

// Tabs
const tabs = [
  { status: 'all', label: 'همه فاکتورها' },
  { status: 'paid', label: 'پرداخت موفق' },
  { status: 'pending', label: 'در انتظار پرداخت' },
  { status: 'unpaid', label: 'پرداخت نشده' },
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

const submitEditInvoice = async () => {
  if (!selectedInvoice.value) return
  try {
    await invoiceStore.updateInvoice(selectedInvoice.value.id, selectedInvoice.value)
    closeEditModal()
  } catch {
    // خطا در استور ست می‌شود
  }
}


const remove = (id: string) => {
  if (confirm('آیا مطمئن هستید؟')) invoiceStore.deleteInvoice(id)
}

// Filtered invoices by active tab
const filteredInvoices = computed(() => {
  let list = invoiceStore.invoices

  if (activeTab.value !== 'all') {
    list = list.filter((inv) => inv.status === activeTab.value)
  }

  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return list

  return list.filter((inv) => {
    const number = String(inv.number ?? '').toLowerCase()
    const client = (inv.client ?? '').toLowerCase()
    const status = (inv.status ?? '').toLowerCase()
    return number.includes(q) || client.includes(q) || status.includes(q)
  })
})
// Helpers
const statusClass = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-dash-accent2/15 text-dash-accent2'
    case 'pending': return 'bg-amber-400/15 text-amber-300'
    case 'unpaid': return 'bg-rose-400/15 text-rose-300'
    default: return 'bg-dash-border text-dash-muted'
  }
}
const tabColor = (status: string) => {
  switch (status) {
    case 'all': return 'bg-dash-accent/15 text-dash-accent border-dash-accent/40'
    case 'paid': return 'bg-dash-accent2/15 text-dash-accent2 border-dash-accent2/40'
    case 'pending': return 'bg-amber-400/15 text-amber-300 border-amber-400/40'
    case 'unpaid': return 'bg-rose-400/15 text-rose-300 border-rose-400/40'
    default: return 'bg-dash-card text-dash-muted border-dash-border'
  }
}

const countColor = (status: string, isActive: boolean) => {
  switch (status) {
    case 'paid': return isActive ? 'bg-dash-accent2' : 'bg-dash-accent2/50'
    case 'pending': return isActive ? 'bg-amber-400' : 'bg-amber-400/50'
    case 'unpaid': return isActive ? 'bg-rose-400' : 'bg-rose-400/50'
    default: return isActive ? 'bg-dash-accent' : 'bg-dash-muted'
  }
}


const tabsWithCount = computed(() => {
  return tabs.map(tab => {
    if (tab.status === 'all') return { ...tab, amount: invoiceStore.invoices.length }
    return { ...tab, amount: invoiceStore.invoices.filter(inv => inv.status === tab.status).length }
  })
})


</script>

<style scoped lang="postcss">
.badge-tab {
  @apply px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition;
}

.badge-tab-active {
  @apply px-4 py-2 rounded-lg text-sm bg-green-100 text-green-700 font-semibold border border-green-300;
}

table th,
table td {
  padding: 12px;
}

/* ردیف‌ها */
tbody tr {
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

tbody tr:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  width: 60%;
  /* حالت عادی طول خط */
  bottom: 0;
  left: 20%;
  /* وسط کردن خط */
  background: #2A2D36;
  border-radius: 2px;
  transition: all 0.3s ease;
  /* انیمیشن روی تغییرات */
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
