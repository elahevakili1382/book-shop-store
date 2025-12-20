<template>
  <transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <!-- BACKDROP -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="onCancel"
      />

      <!-- PANEL -->
      <div
        class="relative w-[min(900px,95%)] bg-white rounded-2xl shadow-2xl p-6 z-10"
        @keydown.esc.prevent="onCancel"
      >
        <!-- HEADER -->
        <header class="flex items-start justify-between mb-5">
          <div>
            <h2 class="text-xl font-bold">
              ویرایش فاکتور
              <span class="text-sm text-gray-500">#{{ local.number }}</span>
            </h2>
            <p class="text-xs text-gray-500 mt-1">تغییرات را اعمال کن و ذخیره کن.</p>
          </div>

          <button
            @click="onCancel"
            class="text-gray-600 hover:text-gray-900 text-xl"
            aria-label="close"
          >
            ✖
          </button>
        </header>

        <!-- FORM -->
        <form @submit.prevent="onSave" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- CLIENT -->
          <FormField label="مشتری" :error="errors.client">
            <input
              v-model="local.client"
              type="text"
              class="input-base"
              required
            />
          </FormField>

          <!-- EMAIL -->
          <FormField label="ایمیل" :error="errors.email">
            <input
              v-model="local.email"
              type="email"
              class="input-base"
            />
          </FormField>

          <!-- ISSUE DATE -->
          <FormField label="تاریخ صدور">
            <input
              v-model="local.dateLocal"
              type="date"
              class="input-base"
            />
          </FormField>

          <!-- DUE DATE -->
          <FormField label="تاریخ سررسید">
            <input
              v-model="local.dueLocal"
              type="date"
              class="input-base"
            />
          </FormField>

          <!-- TOTAL -->
          <FormField label="مبلغ (تومان)" :error="errors.total">
            <input
              v-model.number="local.total"
              type="number"
              class="input-base"
              required
              min="0"
            />
          </FormField>

          <!-- STATUS -->
          <FormField label="وضعیت">
            <select
              v-model="local.status"
              class="input-base bg-white"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </FormField>

          <!-- NOTES -->
          <FormField label="یادداشت" class="md:col-span-2">
            <textarea
              v-model="local.note"
              rows="3"
              class="input-base"
            />
          </FormField>

          <!-- ACTIONS -->
          <div class="md:col-span-2 flex justify-end gap-3 mt-3">
            <button
              type="button"
              class="btn-gray"
              @click="onCancel"
            >
              انصراف
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="btn-blue"
            >
              <span v-if="!saving">ذخیره</span>
              <span v-else>در حال ذخیره…</span>
            </button>
          </div>
        </form>

        <!-- SERVER ERROR -->
        <p v-if="serverError" class="text-red-600 text-sm mt-3">
          {{ serverError }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useInvoiceStore } from "../../stores/useInvoiceStore";
import type { Invoice } from "../../stores/useInvoiceStore"



// Props
const props = defineProps<{ modelValue: boolean; invoice?: any | null }>();
const emit = defineEmits(["update:modelValue", "saved", "error"]);

// Store
const store = useInvoiceStore();

// State
const saving = ref(false);
const serverError = ref<string | null>(null);
const errors = ref<{ [key: string]: string | null }>({});

// Local editable copy
const local = ref({
  id: "",
  number: "",
  client: "",
  email: "",
  dateLocal: "",
  dueLocal: "",
  total: 0,
  status: "Pending",
  note: "",
});

// Watch invoice prop
watch(
  () => props.invoice,
  (nv) => {
    if (!nv) return resetLocal();

    local.value = {
      id: nv.id,
      number: nv.number ?? nv.id,
      client: nv.client ?? "",
      email: nv.email ?? "",
      dateLocal: isoToDateInput(nv.date),
      dueLocal: isoToDateInput(nv.due),
      total: Number(nv.total) || 0,
      status: nv.status ?? "Pending",
      note: nv.note ?? "",
    };
    errors.value = {};
    serverError.value = null;
  },
  { immediate: true }
);

// RESET local form
function resetLocal() {
  local.value = {
    id: "",
    number: "",
    client: "",
    email: "",
    dateLocal: "",
    dueLocal: "",
    total: 0,
    status: "Pending",
    note: "",
  };
}

// Convert ISO → yyyy-mm-dd
function isoToDateInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

// Convert yyyy-mm-dd → ISO
function dateInputToISO(dateStr: string | undefined) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toISOString();
}

// Validate
function validate() {
  errors.value = {};
  let ok = true;

  if (!local.value.client.trim()) {
    errors.value.client = "نام مشتری را وارد کن.";
    ok = false;
  }
  if (local.value.email && !/^\S+@\S+\.\S+$/.test(local.value.email)) {
    errors.value.email = "ایمیل معتبر نیست.";
    ok = false;
  }
  if (local.value.total < 0) {
    errors.value.total = "مبلغ نامعتبر است.";
    ok = false;
  }

  return ok;
}

// Cancel
const onCancel = () => emit("update:modelValue", false);

// Save
const onSave = async () => {
  if (!validate()) return;

  saving.value = true;
  serverError.value = null;

  try {
   const payload: Partial<Invoice> = {
  client: local.value.client,
  email: local.value.email || undefined,
  date: local.value.dateLocal ? dateInputToISO(local.value.dateLocal) || undefined : undefined,
  due: local.value.dueLocal ? dateInputToISO(local.value.dueLocal) || undefined : undefined,
  total: Number(local.value.total),
  status: local.value.status,
  note: local.value.note || ''
}

    const updated = await store.updateInvoice(local.value.id, payload);

    emit("saved", updated);
    emit("update:modelValue", false);
  } catch (err: any) {
    serverError.value = err?.message || String(err);
    emit("error", serverError.value);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Form styles */
.input-base {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white;
}

.btn-gray {
  @apply px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition;
}

.btn-blue {
  @apply px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60;
}
</style>
