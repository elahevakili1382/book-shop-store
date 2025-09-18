<template>
  <section
    class="max-w-5xl w-full mx-auto mt-16 p-6 md:p-12 flex flex-col md:flex-row gap-8"
  >
    <!-- تصویر محصول -->
    <div
      class="flex-shrink-0 w-full md:w-1/3 relative rounded-2xl overflow-hidden shadow-lg"
    >
      <NuxtImg
        :src="product?.image || '/images/default-book.jpg'"
        :alt="product?.title"
        class="w-full h-[600px] object-cover rounded-2xl"
        width="400"
        height="600"
        format="webp"
        priority
      />
    </div>

    <!-- جزئیات محصول -->
    <div class="flex-1 flex flex-col gap-4">
      <h1 class="text-3xl font-bold">{{ product?.title }}</h1>
      <p class="text-gray-500">نویسنده: {{ product?.author || "نامشخص" }}</p>

      <div class="flex items-center gap-3 mt-2">
        <div
          class="flex items-center gap-1 rounded-xl px-4 py-1 bg-[#DCF763] border border-[#435058] text-[#435058]"
        >
          <NuxtImg
            src="/images/Vector-(3).svg"
            alt="آیکون امتیاز"
            width="16"
            height="16"
          />
          <span>{{ product?.rating || "0.0" }}</span>
        </div>
        <p class="text-gray-400 text-sm">140 نظر</p>
      </div>

      <div class="mt-4">
        <p class="text-gray-500 text-sm">قیمت کتاب</p>
        <h2 class="text-2xl font-semibold">{{ formattedPrice }}</h2>
      </div>

      <!-- اطلاعات جدید -->
      <div class="mt-6 grid grid-cols-2 gap-4 text-gray-600">
        <p>
          <span class="font-semibold">ژانر:</span>
          {{ product?.subjects?.join("، ") || "نامشخص" }}
        </p>
        <p>
          <span class="font-semibold">اولین انتشار:</span>
          {{ product?.firstPublish || "نامشخص" }}
        </p>
      </div>

      <div class="mt-6 text-gray-700">
        <h3 class="text-xl font-semibold mb-2">خلاصه کتاب</h3>
        <p class="text-sm line-clamp-5">
          {{ product?.summary || "توضیحی برای این کتاب موجود نیست." }}
        </p>
      </div>

      <div class="mt-6">
        <button
          @click="addProduct"
          class="bg-[#435058] rounded-full text-white flex items-center justify-center gap-2
                 px-8 py-3 hover:bg-[#5b6a6a] transition w-full max-w-xs"
        >
          افزودن به سبد
          <NuxtImg
            src="/images/user.svg"
            alt="افزودن به سبد خرید"
            width="20"
            height="20"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { useProductStore } from "@/stores/productStore"
import type { ProductDetail } from "@/stores/productStore"
import { useCartStore } from "@/stores/cart"
import { NuxtImg } from "#components"

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref<ProductDetail | null>(null)

const formattedPrice = computed(() =>
  product.value
    ? new Intl.NumberFormat("fa-IR").format(product.value.price) + " تومان"
    : ""
)

function addProduct() {
  if (!product.value) return
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.title,
    price: product.value.price,
  })
}

onMounted(async () => {
  const id = route.params.id as string
  product.value = await productStore.fetchProductById(id)
})
</script>
