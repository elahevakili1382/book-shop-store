<template>
    <nav class="text-sm text-gray-500 flex items-center gap-2">
        <template v-for="(item,index) in items" :key="index">
            <span :class="[
                index === items.length - 1 ? 'text-gray-800 font-semibold' : 'hover:text-gray-700 cursor-pointer'
            ]"
            >
            {{ item }}
            </span>

            <!--separator-->
            <span v-if="index !== items.length -1">/</span>
        </template>
    </nav>

</template>

<script setup lang="ts">
    defineProps<{
        items:string[]
    }>()
</script>