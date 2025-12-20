<template>
  <section class="min-h-screen bg-gradient-to-b py-12 px-4">
    <div class="container mx-auto">

      <!-- عنوان -->
      <h1 class="text-3xl font-bold mb-10 text-gray-900">سبد خرید</h1>

      <div v-if="isMounted">
      <!-- وقتی خالیه -->
      <div v-if="cart.cartItems.length === 0" class="text-gray-500 text-center py-20 text-lg">
        سبد خرید شما خالی است.
      </div>

      <!-- وقتی آیتم دارد -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- ستون آیتم‌ها -->
        <div class="lg:col-span-2 space-y-6">
          <div
            v-for="item in cart.cartItems"
            :key="item.uniqueId"
            class="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1 hover:scale-105"
          >
            <!-- تصویر -->
            <NuxtImg
              :src="item.image"
              class="w-24 h-24 object-cover rounded-lg"
            />
            
            <!-- اطلاعات محصول -->
            <div class="flex-1">
              <p class="font-semibold text-gray-900 text-lg">{{ item.name }}</p>
              <p class="text-gray-500 mt-1">
                {{ item.quantity }} × {{ new Intl.NumberFormat('fa-IR').format(item.price) }} تومان
              </p>
            </div>

            <!-- کنترل تعداد -->
            <div class="flex items-center gap-2">
              <button
                @click="cart.updateQuantity(item.uniqueId, item.quantity - 1)"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-lg"
              >-</button>

              <span class="font-medium text-gray-700">{{ item.quantity }}</span>

              <button
                @click="cart.updateQuantity(item.uniqueId, item.quantity + 1)"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-lg"
              >+</button>
            </div>

            <!-- حذف -->
            <button
              @click="cart.removeFromCart(item.uniqueId)"
              class="ml-4 text-red-500 hover:text-red-700 transition"
              title="حذف"
            >
              <FontAwesome :icon="['fas','trash']" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- ستون جمع کل و سایر بخش‌ها -->
        <div class="space-y-6">

          <!-- جمع کل -->
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <p class="font-bold text-lg mb-4 text-gray-900">
              جمع کل: {{ new Intl.NumberFormat("fa-IR").format(cart.cartTotal) }} تومان
            </p>
            <button
              class="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-md"
            >
              ادامه خرید / تسویه حساب
            </button>
          </div>

          <!-- آدرس حمل و نقل -->
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <h2 class="font-bold mb-2 text-gray-900">آدرس حمل و نقل</h2>
            <textarea
              placeholder="آدرس خود را وارد کنید..."
              class="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-200 outline-none resize-none"
              rows="3"
            ></textarea>
          </div>

          <!-- قوانین حمل و نقل -->
          <div class="p-6 rounded-2xl bg-white shadow-md text-gray-700 text-sm">
            <h2 class="font-bold mb-2 text-gray-900">قوانین حمل و نقل</h2>
            <p>
              سفارشات شما طی ۳ تا ۵ روز کاری ارسال خواهند شد. لطفاً قبل از ثبت
              نهایی اطلاعات خود را بررسی کنید.
            </p>
          </div>

          <!-- روش‌های پرداخت -->
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <h2 class="font-bold mb-2 text-gray-900">روش‌های پرداخت</h2>
            <ul class="space-y-3">
              <li>
                <label class="flex items-center gap-3 cursor-pointer text-gray-700">
                  <input type="radio" name="payment" value="online" checked class="accent-green-600" />
                  پرداخت آنلاین
                </label>
              </li>
              <li>
                <label class="flex items-center gap-3 cursor-pointer text-gray-700">
                  <input type="radio" name="payment" value="delivery" class="accent-green-600" />
                  پرداخت در محل
                </label>
              </li>
            </ul>
          </div>

        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

const isMounted = ref(false)

onMounted(() => {
  cart.loadCart()
  isMounted.value = true
})

</script>
