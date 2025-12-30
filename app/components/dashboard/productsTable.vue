<template>
    <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-semibold text-gray-800">لیست محصولات</h2>

            <button class="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            @click="openAddModal"
            >+ افزودن محصول</button>
        </div>
      

        <div v-if="loading" class="flex justify-center items-center py-16">
       <span class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"> 
      </span>
      </div>

      <div v-else-if="products.length === 0"
     class="py-16 text-center text-gray-400">
  محصولی وجود ندارد
</div>


      <div v-else class="overflow-x-auto">

        <table class="min-w-[700px] w-full text-right text-sm md:text-base border-separate border-spacing-y-3">
            <thead class="border-b sticky top-0 bg-white z-10">
                <tr class="text-gray-600">
                <th class="py-3">نام محصول</th>
                <th>دسته بندی </th>
                <th>قیمت </th>
                <th>تعداد</th>
                <th>وضعیت </th>
                <th> عملیات</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id" class="bg-gray-50 hover:bg-gray-100 transition rounded-xl">
                    <td class="py-3 font-semibold">{{ product.title }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ formatPrice(product.price)}} تومان</td>
                    <td>
                        <input
                          type="number"
                          min="0"
                          class="w-16 border border-gray-700 rounded text-center"
                          v-model.number="product.quantity"
                          @change="updateQuantity(product)"
                        />
                    </td>



                    <td>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold " 
                        :class="product.quantity > 10 
                        ? 'bg-green-100 text-green-700' 
                        :product.quantity > 0 ?
                         'bg-yellow-100 text-yellow-700': 
                        'bg-red-100 text-red-700'">
                        {{ product.quantity > 10 ? 'موجود' : product.quantity > 0 ? 'موجود محدود ' : 'نا موجود'}}</span>
                    </td>
                    <td class="flex gap-2 md:gap-3">
                        <button class="text-blue-600 hover:text-blue-800" @click="openEditModal(product)"> ✏️ </button>
                        <button class="text-red-500 hover:text-red-700" @click="$emit('delete',product.id)"> 🗑️ </button>
                    </td>
                </tr>
            </tbody>
        </table>

      </div>
        

        <!-- <div v-if="!loading && products.length === 0" class="py-10 text-center text-gray-400">محصولی وجود ندارد </div> -->

        <div class="flex justify-center gap-2 mt-6 ">
            <button v-for="page in totalPages" :key="page" @click="currentPage = page" 
            class="px-3 py-1 rounded-lg border text-sm" 
            :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'"
            >{{ page }}</button>
        </div>

        <!-- modal for edit product-->
         <div v-if="showEditModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
         <div class="bg-white rounded-2xl w-full max-w-md p-6">
         <h3 class="font-semibold text-lg mb-4">ویرایش محصول</h3>

         <form v-if="editProduct" @submit.prevent="submitEditProduct" class="space-y-4">
      <input v-model="editProduct!.title" type="text" placeholder="نام محصول" class="w-full border rounded-lg px-3 py-2" required />
      <input v-model="editProduct!.price" type="number" placeholder="قیمت" class="w-full border rounded-lg px-3 py-2" required />
      <select v-model="editProduct!.category" class="w-full border rounded-lg px-3 py-2" required>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <input type="number" min="0" v-model.number="editProduct!.quantity" class="w-full border border-gray-800 rounded-lg px-3 py-2" placeholder="تعداد" />
      
      <div class="flex justify-end gap-3 pt-4">
        <button type="button" @click="closeEditModal" class="px-4 py-2 rounded-lg bg-gray-200">انصراف</button>
        <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ذخیره</button>
      </div>
    </form>

  </div>
</div>




        <!-- modal for add product  -->
         <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl w-full max-w-md p-6">

                <!-- header  -->
                 <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-lg">افزودن محصول جدید</h3>
                    <button @click="closeAddModal">✖️</button>
                 </div>

                 <form @submit.prevent="submitProduct" class="space-y-4">
                    <input v-model="form.title" type="text" placeholder="نام محصول" class="w-full border rounded-lg px-3 py-2 hover:border-gray-800 transition" required>
                    <input v-model="form.price" type="number" placeholder="قیمت" class="w-full border rounded-lg px-3 py-2 hover:border-gray-800 transition" required>
                    <select v-model="form.category" class="w-full border rounded-lg px-3 py-2 text-black hover:border-gray-800 transition" required>
                        <option value="" disabled class="text-bold">دسته بندی</option>
                        <option v-for="cat in categories" :key="cat" :value="cat" class="text-black">{{ cat }}</option>
                    </select>
                     <input
                          type="number"
                          min="0"
                          class="w-full rounded-lg border px-3 py-2 hover:border-gray-800 transition"
                          placeholder="تعداد"
                          v-model.number="form.quantity"
                        />

                    <div class="flex justify-end gap-3 pt-4">
                        <button type="button" class="px-4 py-2 rounded-lg bg-gray-200" @click="closeAddModal">انصراف</button>
                        <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ذخیره</button>
                    </div>

                 </form>
            </div>
         </div>
    </div>

</template>
<script lang="ts" setup>
import{ref, reactive, computed} from 'vue'

const store = useProductStore()
import type { Product } from '../../stores/productStore'
import { formatPrice } from '../../utils/formatPrice'

const currentPage = ref(1)
const pageSize = 10
const categories = computed(() => store.categories)
const editProduct = ref<Product | null>(null)

const showEditModal = ref(false)

const props = defineProps<{
products: Product[]
loading?: boolean 
}>()
type NewProductInput = {
  title: string
  price: number
  category: string
  quantity: number
}


const emit = defineEmits<{
    (e: 'add', product:NewProductInput):void
    (e:'delete', id:string): void
    (e:'update', product: Product): void
   }>()

const totalPages = computed(() =>{
    return Math.ceil(props.products.length / pageSize)
})

   const showAddModal = ref(false)

   function openAddModal(){
    showAddModal.value = true
   }

   function closeAddModal() {
    showAddModal.value = false
    resetForm()
   }

   const form = reactive({
    title:'',
    price:0,
    category:'',
    quantity:0
   })

   function resetForm(){
    form.title = ''
    form.price = 0
    form.category = ''
   }

const paginatedProducts = computed (() =>{
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return props.products.slice(start,end)
   })

   function openEditModal(product: Product){
    editProduct.value = {...product}
    showEditModal.value = true
   }

   function submitEditProduct() {
  if (!editProduct.value) return

  emit('update', { ...editProduct.value })

  closeEditModal()
}


   function closeEditModal(){
    showEditModal.value = false
    editProduct.value = null

   }


function submitProduct() {
    emit('add',{
        title: form.title,
        price: form.price,
        category: form.category,
        quantity: Number(form.quantity),

    })
    closeAddModal()
     currentPage.value = 1
   }

   function updateQuantity(product : Product) {
    $fetch<void>(`/api/product/${product.id}`, {
        method: 'POST' as 'POST',
        body: { quantity:product.quantity }
    })
   }
 
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
