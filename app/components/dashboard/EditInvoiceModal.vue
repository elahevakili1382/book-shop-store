<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <!-- backdrop -->
<!-- backdrop مودال با بلور -->
<div
  class="absolute inset-0 bg-gray-50/30 backdrop-blur-2طم"
  @click="onCancel"
/>

      <!-- panel -->
      <div
        class="relative w-[min(920px,96%)] max-w-2xl bg-white/40 rounded-2xl shadow-2xl p-6 z-10"
        @keydown.esc.prevent="onCancel"
        role="document"
        aria-labelledby="modal-title"
      >
        <header class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="modal-title" class="text-lg font-bold">ویرایش فاکتور <span class="text-sm text-gray-500">#{{ local.number }}</span></h2>
            <p class="text-xs text-gray-500 mt-1">تغییرات را انجام بده و ذخیره کن.</p>
          </div>

          <button @click="onCancel" aria-label="Close modal" class="text-gray-500 hover:text-gray-800">
            ✖
          </button>
        </header>

        <form @submit.prevent="onSave" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <!-- client -->
            <label class="block">
              <div class="text-xs text-gray-500 mb-1">مشتری</div>
              <input
                v-model="local.client"
                type="text"
                class="w-full border rounded px-3 py-2 boder focus:outline-none"
                :class="{ 'ring-2 ring-red-300': errors.client }"
                required
                aria-invalid="false"
              />
              <p v-if="errors.client" class="text-xs text-red-600 mt-1">{{ errors.client }}</p>
            </label>

            <!-- email -->
            <label class="block">
              <div class="text-xs text-gray-500 mb-1">ایمیل</div>
              <input
                v-model="local.email"
                type="email"
                class="w-full border rounded px-3 py-2 focus:outline-none"
                :class="{ 'ring-2 ring-red-300': errors.email }"
              />
              <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
            </label>

            <!-- date -->
            <label class="block">
              <div class="text-xs text-gray-500 mb-1">تاریخ صدور</div>
              <input
                v-model="local.dateLocal"
                type="date"
                class="w-full border rounded px-3 py-2 focus:outline-none"
              />
            </label>

            <!-- due -->
            <label class="block">
              <div class="text-xs text-gray-500 mb-1">تاریخ سررسید</div>
              <input
                v-model="local.dueLocal"
                type="date"
                class="w-full border rounded px-3 py-2 focus:outline-none"
              />
            </label>

            <!-- total -->
            <label class="block md:col-span-1">
              <div class="text-xs text-gray-500 mb-1">مبلغ (تومان)</div>
              <input
                v-model.number="local.total"
                type="number"
                min="0"
                step="0.01"
                class="w-full border rounded px-3 py-2 focus:outline-none"
                :class="{ 'ring-2 ring-red-300': errors.total }"
                required
              />
              <p v-if="errors.total" class="text-xs text-red-600 mt-1">{{ errors.total }}</p>
            </label>

            <!-- status -->
            <label class="block">
              <div class="text-xs text-gray-500 mb-1">وضعیت</div>
              <div class="relative">
                <select v-model="local.status" class="w-full border rounded px-3 py-2 focus:outline-none">
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Unpaid">Unpaid</option>
                </select>

                <!-- visual badge -->
                <div class="absolute left-3 top-1/2 -translate-y-1/2">
                  <span :class="statusBadgeClass(local.status)" class="px-2 py-0.5 text-xs rounded-full">
                    {{ local.status }}
                  </span>
                </div>
              </div>
            </label>

            <!-- notes (optional) -->
            <label class="block md:col-span-2 l">
              <div class="text-xs text-gray-500 mb-1 ">یادداشت (اختیاری)</div>
              <textarea v-model="local.note" rows="3" class="w-full border rounded px-3 py-2 focus-optional" />
            </label>
          </div>

          <!-- actions -->
          <div class="flex items-center justify-end gap-3 mt-4">
            <button type="button" @click="onCancel" class="px-4 py-2 rounded bg-gray-100">انصراف</button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
            >
              <span v-if="!saving">ذخیره</span>
              <span v-else>در حال ذخیره…</span>
            </button>
          </div>
        </form>

        <!-- error message -->
        <p v-if="serverError" class="mt-3 text-sm text-red-600">{{ serverError }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useInvoiceStore } from '~/stores/useInvoiceStore'

/**
 * Props:
 *  - modelValue: boolean (v-model)
 *  - invoice: object (invoice to edit)
 * Emits:
 *  - update:modelValue
 *  - saved (payload returned)
 *  - error (message)
 */

const props = defineProps<{
  modelValue: boolean
  invoice?: any | null
}>()

const emit = defineEmits(['update:modelValue', 'saved', 'error'])

const store = useInvoiceStore()
const saving = ref(false)
const serverError = ref<string | null>(null)

// local editable copy
const local = ref({
  id: '',
  number: '',
  client: '',
  email: '',
  dateLocal: '',
  dueLocal: '',
  total: 0,
  status: 'Pending',
  note: ''
})

// validation errors
const errors = ref<{ [k: string]: string | null }>({})

// convert status to colored badge classes
const statusBadgeClass = (s: string | undefined) => {
  switch (s) {
    case 'Paid':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Unpaid':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// when invoice prop changes, populate local
watch(
  () => props.invoice,
  (nv) => {
    if (!nv) {
      resetLocal()
      return
    }
    local.value.id = nv.id ?? ''
    local.value.number = nv.number ?? nv.id ?? ''
    local.value.client = nv.client ?? ''
    local.value.email = nv.email ?? ''
    // convert ISO -> yyyy-mm-dd for input[type=date]
    local.value.dateLocal = nv.date ? isoToDateInput(nv.date) : ''
    local.value.dueLocal = nv.due ? isoToDateInput(nv.due) : ''
    local.value.total = typeof nv.total === 'number' ? nv.total : Number(nv.total) || 0
    local.value.status = nv.status ?? 'Pending'
    local.value.note = nv.note ?? ''
    serverError.value = null
    errors.value = {}
  },
  { immediate: true }
)

function resetLocal() {
  local.value = {
    id: '',
    number: '',
    client: '',
    email: '',
    dateLocal: '',
    dueLocal: '',
    total: 0,
    status: 'Pending',
    note: ''
  }
}

// helper: convert ISO string to yyyy-mm-dd (for input[type=date])
function isoToDateInput(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  // get local date part in ISO format (yyyy-mm-dd)
  const tzOffset = d.getTimezoneOffset() * 60000
  const localISO = new Date(d.getTime() - tzOffset).toISOString().slice(0, 10)
  return localISO
}

// helper: convert date input back to ISO (midnight UTC)
function dateInputToISO(dateStr: string | undefined) {
  if (!dateStr) return null
  // create ISO at midnight in local timezone
  const dt = new Date(dateStr)
  return dt.toISOString()
}

// simple client-side validation
function validate() {
  errors.value = {}
  let ok = true
  if (!local.value.client || local.value.client.trim().length < 2) {
    errors.value.client = 'نام مشتری را وارد کن (حداقل 2 کاراکتر).'
    ok = false
  }
  if (local.value.email && !/^\S+@\S+\.\S+$/.test(local.value.email)) {
    errors.value.email = 'ایمیل نامعتبر است.'
    ok = false
  }
  if (local.value.total === null || isNaN(Number(local.value.total)) || Number(local.value.total) < 0) {
    errors.value.total = 'مبلغ را درست وارد کن.'
    ok = false
  }
  return ok
}

const onCancel = () => {
  emit('update:modelValue', false)
}

const onSave = async () => {
  serverError.value = null
  if (!validate()) return

  saving.value = true
  try {
    const payload: any = {
      client: local.value.client,
      email: local.value.email || null,
      date: dateInputToISO(local.value.dateLocal),
      due: dateInputToISO(local.value.dueLocal),
      total: Number(local.value.total),
      status: local.value.status,
      note: local.value.note || ''
    }

    // call store update (PUT) — returns updated item
    const updated = await store.updateInvoice(local.value.id, payload)
    // emit saved & close
    emit('saved', updated)
    emit('update:modelValue', false)
  } catch (err: any) {
    serverError.value = err?.message ?? String(err)
    emit('error', serverError.value)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.modal-fade-enter-from { opacity: 0; transform: translateY(6px) scale(.995); }
.modal-fade-enter-to { opacity: 1; transform: translateY(0) scale(1); }
.modal-fade-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.modal-fade-leave-to { opacity: 0; transform: translateY(6px) scale(.995); }
.focus-optional{
    border: 1px solid #ccc;       
  border-radius: 8px;         
  padding: 0.5rem 0.75rem;     
  transition: all 0.25s ease;  
  outline: none;                
  box-shadow: none;  
}
.focus-optional:focus{
     border: 2px solid #1d4ed8;    
  box-shadow: 0 4px 10px rgba(29, 78, 216, 0.25); 
  transform: scale(1.02);  
}
input {
  border: 1px solid #ccc;       
  border-radius: 8px;         
  padding: 0.5rem 0.75rem;     
  transition: all 0.25s ease;  
  outline: none;                
  box-shadow: none;            
}

/* حالت فوکوس */
input:focus {
  border: 2px solid #1d4ed8;    
  box-shadow: 0 4px 10px rgba(29, 78, 216, 0.25); 
  transform: scale(1.02);       
}


</style>
