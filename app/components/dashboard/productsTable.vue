<template>
  <div class="rounded-2xl border border-dash-border bg-dash-card p-4 sm:p-6">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-lg font-semibold text-dash-text">لیست محصولات</h2>

      <button
        type="button"
        class="min-h-11 rounded-xl bg-dash-accent px-4 text-sm font-bold text-dash-bg hover:opacity-90"
        @click="openAddModal"
      >
        افزودن محصول
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-16">
      <span class="h-10 w-10 animate-spin rounded-full border-4 border-dash-accent border-t-transparent" />
    </div>

    <div v-else-if="products.length === 0" class="py-16 text-center text-dash-muted">
      محصولی وجود ندارد
    </div>

    <template v-else>
      <ul class="space-y-3 md:hidden">
        <li
          v-for="product in paginatedProducts"
          :key="product.id"
          class="rounded-2xl bg-dash-bg p-4"
        >
          <p class="font-bold text-dash-text">{{ product.title }}</p>
          <p class="mt-1 text-xs text-dash-muted">{{ categoryLabel(product.category) }}</p>
          <div class="mt-3 flex items-center justify-between gap-3">
            <p class="text-sm font-black text-dash-text">{{ formatPrice(product.price) }}</p>
            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-bold"
              :class="product.quantity > 10
                ? 'bg-dash-accent2/15 text-dash-accent2'
                : product.quantity > 0
                  ? 'bg-amber-400/15 text-amber-300'
                  : 'bg-rose-400/15 text-rose-300'"
            >
              {{ product.quantity > 10 ? 'موجود' : product.quantity > 0 ? 'محدود' : 'ناموجود' }}
            </span>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <input
              v-model.number="product.quantity"
              type="number"
              min="0"
              class="h-11 w-20 rounded-xl border border-dash-border bg-dash-card text-center text-dash-text"
              @change="updateQuantity(product)"
            />
            <button type="button" class="flex h-11 flex-1 items-center justify-center rounded-xl border border-dash-border text-sm font-bold text-dash-text" @click="openEditModal(product)">
              ویرایش
            </button>
            <button type="button" class="flex h-11 items-center justify-center rounded-xl px-3 text-sm font-bold text-rose-300" @click="deleteProduct(product)">
              حذف
            </button>
          </div>
        </li>
      </ul>

      <div class="hidden overflow-x-auto md:block">
        <table class="w-full min-w-[700px] border-separate border-spacing-y-3 text-right text-sm text-dash-text">
          <thead>
            <tr class="text-dash-muted">
              <th class="py-3">نام محصول</th>
              <th>دسته‌بندی</th>
              <th>قیمت</th>
              <th>تعداد</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="rounded-xl bg-dash-bg"
            >
              <td class="py-3 font-semibold">{{ product.title }}</td>
              <td class="text-dash-muted">{{ categoryLabel(product.category) }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>
                <input
                  v-model.number="product.quantity"
                  type="number"
                  min="0"
                  class="w-16 rounded-lg border border-dash-border bg-dash-card text-center text-dash-text"
                  @change="updateQuantity(product)"
                />
              </td>
              <td>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="product.quantity > 10
                    ? 'bg-dash-accent2/15 text-dash-accent2'
                    : product.quantity > 0
                      ? 'bg-amber-400/15 text-amber-300'
                      : 'bg-rose-400/15 text-rose-300'"
                >
                  {{ product.quantity > 10 ? 'موجود' : product.quantity > 0 ? 'موجود محدود' : 'ناموجود' }}
                </span>
              </td>
              <td>
                <div class="flex gap-3">
                  <button type="button" class="text-sm font-bold text-dash-accent" @click="openEditModal(product)">ویرایش</button>
                  <button type="button" class="text-sm font-bold text-rose-300" @click="deleteProduct(product)">حذف</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>


    <div v-if="!loading && products.length > 0 && totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
      <button type="button"
        class="px-3 py-1 rounded-lg border border-dash-border text-sm bg-dash-bg text-dash-muted hover:text-dash-text disabled:opacity-40"
        :disabled="currentPage <= 1" @click="goPrev">
        قبلی
      </button>
      <button v-for="page in totalPages" :key="page" type="button"
        class="px-3 py-1 rounded-lg border border-dash-border text-sm"
        :class="page === currentPage ? 'bg-dash-accent text-dash-bg font-bold' : 'bg-dash-bg text-dash-muted hover:text-dash-text'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button type="button"
        class="px-3 py-1 rounded-lg border border-dash-border text-sm bg-dash-bg text-dash-muted hover:text-dash-text disabled:opacity-40"
        :disabled="currentPage >= totalPages" @click="goNext">
        بعدی
      </button>
    </div>

    <!-- modal for edit product-->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-dash-border bg-dash-card p-5 text-dash-text sm:rounded-2xl sm:p-6">
        <h3 class="mb-4 text-lg font-semibold">ویرایش محصول</h3>

        <form v-if="editProduct" class="space-y-3" @submit.prevent="submitEditProduct">
          <input v-model="editProduct.title" type="text" required placeholder="نام کتاب" :class="fieldClass" />
          <div class="grid grid-cols-2 gap-2">
            <input v-model="editProduct.author" type="text" placeholder="نویسنده" :class="fieldClass" />
            <input v-model="editProduct.publisher" type="text" placeholder="ناشر" :class="fieldClass" />
          </div>
          <select v-model="editProduct.category" required :class="fieldClass">
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ categoryLabel(cat) }}</option>
          </select>
          <div class="grid grid-cols-2 gap-2">
            <input v-model.number="editProduct.price" type="number" required placeholder="قیمت" :class="fieldClass" />
            <input v-model.number="editProduct.quantity" type="number" min="0" placeholder="موجودی" :class="fieldClass" />
          </div>
          <input v-model.number="editProduct.pages" type="number" min="0" placeholder="تعداد صفحات" :class="fieldClass" />

          <label class="block text-xs font-bold text-dash-muted">
            توضیحات
            <textarea v-model="editProduct.description" rows="4" placeholder="خلاصه کتاب برای صفحه محصول" :class="fieldClass + ' mt-1'" />
          </label>
          <label class="block text-xs font-bold text-dash-muted">
            ویژگی‌ها
            <textarea v-model="editFeaturesText" rows="4" placeholder="هر خط یک ویژگی، مثلاً جلد سخت" :class="fieldClass + ' mt-1'" />
          </label>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" class="min-h-11 rounded-xl bg-dash-border px-4 text-sm" @click="closeEditModal">انصراف</button>
            <button type="submit" class="min-h-11 rounded-xl bg-dash-accent px-4 text-sm font-bold text-dash-bg">ذخیره</button>
          </div>
        </form>
      </div>
    </div>

    <!-- modal for add product  -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-dash-border bg-dash-card p-5 text-dash-text sm:rounded-2xl sm:p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">افزودن محصول جدید</h3>
          <button type="button" class="text-dash-muted hover:text-dash-text" aria-label="بستن" @click="closeAddModal">✕</button>
        </div>

        <form class="space-y-3" @submit.prevent="submitProduct">
          <input v-model="form.title" type="text" required placeholder="نام کتاب" :class="fieldClass" />
          <div class="grid grid-cols-2 gap-2">
            <input v-model="form.author" type="text" placeholder="نویسنده" :class="fieldClass" />
            <input v-model="form.publisher" type="text" placeholder="ناشر" :class="fieldClass" />
          </div>
          <select v-model="form.category" required :class="fieldClass">
            <option value="" disabled>دسته‌بندی</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ categoryLabel(cat) }}</option>
          </select>
          <div class="grid grid-cols-2 gap-2">
            <input v-model.number="form.price" type="number" required placeholder="قیمت" :class="fieldClass" />
            <input v-model.number="form.quantity" type="number" min="0" placeholder="موجودی" :class="fieldClass" />
          </div>
          <input v-model.number="form.pages" type="number" min="0" placeholder="تعداد صفحات" :class="fieldClass" />

          <label class="block text-xs font-bold text-dash-muted">
            توضیحات
            <textarea v-model="form.description" rows="4" placeholder="خلاصه کتاب برای صفحه محصول" :class="fieldClass + ' mt-1'" />
          </label>
          <label class="block text-xs font-bold text-dash-muted">
            ویژگی‌ها
            <textarea v-model="form.featuresText" rows="4" placeholder="هر خط یک ویژگی، مثلاً ترجمه فارسی" :class="fieldClass + ' mt-1'" />
          </label>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" class="min-h-11 rounded-xl bg-dash-border px-4 text-sm" @click="closeAddModal">انصراف</button>
            <button type="submit" class="min-h-11 rounded-xl bg-dash-accent px-4 text-sm font-bold text-dash-bg">ذخیره</button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import type { Product } from '~/types/types'
import { formatPrice } from '../../utils/formatPrice'
import { categoryLabel, CATEGORY_SLUGS } from '../../utils/categoryLabel'

const props = defineProps<{
  products: Product[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'add', product: NewProductInput): void
  (e: 'delete', id: string): void
  (e: 'update', product: Product): void
}>()

type NewProductInput = {
  title: string
  price: number
  category: string
  quantity: number
  description: string
  features: string[]
  author?: string
  publisher?: string
  pages?: number
}

const store = useProductStore()

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => {
  const pages = Math.ceil(props.products.length / pageSize)
  return pages > 0 ? pages : 1
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.products.slice(start, start + pageSize)
})

const categories = computed(() => store.categories)
const categoryOptions = computed(() => {
  const set = new Set([...CATEGORY_SLUGS, ...categories.value])
  return Array.from(set)
})
const fieldClass =
  'w-full rounded-xl border border-dash-border bg-dash-bg px-3 py-2.5 text-sm text-dash-text'
const editProduct = ref<Product | null>(null)
const editFeaturesText = ref('')
const showEditModal = ref(false)
const showAddModal = ref(false)

const form = reactive({
  title: '',
  price: 0,
  category: '',
  quantity: 0,
  description: '',
  featuresText: '',
  author: '',
  publisher: '',
  pages: undefined as number | undefined,
})

watch(
  () => props.products.length,
  () => {
    currentPage.value = 1
  }
)

function goPrev() {
  if (currentPage.value > 1) currentPage.value--
}

function goNext() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function openAddModal() {
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  resetForm()
}

function parseFeatures(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function resetForm() {
  form.title = ''
  form.price = 0
  form.category = ''
  form.quantity = 0
  form.description = ''
  form.featuresText = ''
  form.author = ''
  form.publisher = ''
  form.pages = undefined
}

function openEditModal(product: Product) {
  editProduct.value = { ...product }
  editFeaturesText.value = (product.features || []).join('\n')
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editProduct.value = null
}

function submitEditProduct() {
  if (!editProduct.value) return
  emit('update', {
    ...editProduct.value,
    features: parseFeatures(editFeaturesText.value),
    description: editProduct.value.description || '',
  })
  closeEditModal()
}

function submitProduct() {
  emit('add', {
    title: form.title,
    price: form.price,
    category: form.category,
    quantity: Number(form.quantity),
    description: form.description.trim(),
    features: parseFeatures(form.featuresText),
    author: form.author.trim() || undefined,
    publisher: form.publisher.trim() || undefined,
    pages: form.pages,
  })
  closeAddModal()
  currentPage.value = 1
}

function productIdString(product: Product): string {
  const raw = product._id ?? product.id
  return raw != null ? String(raw) : ''
}

function deleteProduct(product: Product) {
  const id = productIdString(product)
  if (!id) return
  emit('delete', id)
}

function updateQuantity(product: Product) {
  const id = productIdString(product)
  if (!id) return
  // فعلاً فقط UI؛ اگر API محصول نداشت، خطا نده صفحه را
  $fetch(`/api/product/${id}`, {
    method: 'POST',
    body: { quantity: product.quantity },
  }).catch(() => { })
}
</script>

<style scoped lang="postcss">
.badge-tab {
  @apply px-4 py-2 text-dash-muted bg-dash-bg rounded-lg text-sm hover:bg-dash-border/40 transition;
}

.badge-tab-active {
  @apply px-4 py-2 rounded-lg text-sm bg-dash-accent/15 text-dash-accent font-semibold border border-dash-accent/40;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
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

thead th::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 60%;
  bottom: 0;
  left: 20%;
  background: #2A2D36;
  border-radius: 2px;
  transition: all 0.3s ease;
}

thead th:hover {
  transform: translateY(-1px) scale(1.03);
  color: #DCF763;
}

thead th:hover::after {
  width: 100%;
  left: 0;
  background: #DCF763;
}
</style>
