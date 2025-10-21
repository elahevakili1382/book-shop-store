<template>
    <header class="flex items-center justify-between bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <h1 class="text-lg font-semibold">Admin Dashboard</h1>

        <div class="flex items-center gap-4">
            <button class="relative">
                <Bell class="w-5 h-5 "/>
        <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div class="flex items-center gap-2 cursor-pointer">
        <img src="https://i.pravatar.cc/40" alt="User" class="w-8 h-8 rounded-full" />
        <span class="text-sm font-medium">مدیر</span>
      </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import{Bell} from   'lucide-vue-next'
</script>