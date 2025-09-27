<template>
  <section class="container mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-6">سبد خرید</h1>

    <!-- وقتی خالیه -->
    <div v-if="cart.cartItems.length === 0" class="text-gray-500 text-center py-10">
      سبد خرید شما خالی است.
    </div>

    <!-- وقتی آیتم داره -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- ستون آیتم‌ها -->
      <div class="md:col-span-2 space-y-4">
        <div
          v-for="item in cart.cartItems"
          :key="item.uniqueId"
          class="grid grid-cols-12 items-center border rounded-lg p-4 gap-4 bg-white shadow-sm hover:shadow-md transition"
        >
          <!-- تصویر و اطلاعات -->
          <div class="col-span-6 flex items-center gap-4">
            <NuxtImg :src="item.image" class="w-16 h-16 object-cover rounded-lg border" />
            <div>
              <p class="font-medium text-gray-800">{{ item.name }}</p>
              <p class="text-sm text-gray-600">
                {{ item.quantity }} × {{ new Intl.NumberFormat('fa-IR').format(item.price) }} تومان
              </p>
            </div>
          </div>

          <!-- کنترل تعداد -->
          <div class="col-span-4 flex items-center gap-2 justify-center">
            <button
              @click="cart.updateQuantity(item.uniqueId, item.quantity - 1)"
              class="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-50 hover:bg-gray-100 text-lg"
            >-</button>

            <span class="font-medium">{{ item.quantity }}</span>

            <button
              @click="cart.updateQuantity(item.uniqueId, item.quantity + 1)"
              class="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-50 hover:bg-gray-100 text-lg"
            >+</button>
          </div>

          <!-- حذف -->
          <div class="col-span-2 flex justify-end">
            <button
              @click="cart.removeFromCart(item.uniqueId)"
              class="text-red-500 hover:text-red-700"
              title="حذف"
            >
              <FontAwesome :icon="['fas','trash']" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- ستون جمع کل و سایر بخش‌ها -->
      <div class="space-y-6">
        <!-- جمع کل -->
        <div class="p-4 border rounded-lg bg-gray-50 shadow-sm">
          <p class="font-bold text-lg mb-2 text-gray-800">
            جمع کل: {{ new Intl.NumberFormat("fa-IR").format(cart.cartTotal) }} تومان
          </p>
          <button
            class="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ادامه خرید / تسویه حساب
          </button>
        </div>

        <!-- آدرس حمل و نقل -->
        <div class="p-4 border rounded-lg bg-gray-50 shadow-sm">
          <h2 class="font-bold mb-2">آدرس حمل و نقل</h2>
          <textarea
            placeholder="آدرس خود را وارد کنید..."
            class="w-full p-2 border rounded focus:ring focus:ring-green-200 outline-none"
            rows="3"
          ></textarea>
        </div>

        <!-- قوانین حمل و نقل -->
        <div class="p-4 border rounded-lg bg-gray-50 text-sm text-gray-700 shadow-sm">
          <h2 class="font-bold mb-2">قوانین حمل و نقل</h2>
          <p>
            سفارشات شما طی ۳ تا ۵ روز کاری ارسال خواهند شد. لطفاً قبل از ثبت
            نهایی اطلاعات خود را بررسی کنید.
          </p>
        </div>

        <!-- روش‌های پرداخت -->
        <div class="p-4 border rounded-lg bg-gray-50 shadow-sm">
          <h2 class="font-bold mb-2">روش‌های پرداخت</h2>
          <ul class="space-y-2">
            <li>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" value="online" checked />
                پرداخت آنلاین
              </label>
            </li>
            <li>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" value="delivery" />
                پرداخت در محل
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cart";
const cart = useCartStore();
cart.loadCart();
</script>
