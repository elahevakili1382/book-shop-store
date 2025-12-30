<template>
    <div class="bg-white rounded-xl p-6 shadow">
        <h2 class="text-lg font-semibold mb-4">پروفایل کاربر </h2>

        <div v-if="store.loading" class="text-gray-500">
            در حال بارگذاری
        </div>

        <div v-else-if="store.error" class="text-red-500">
            {{ store.error }}
        </div>

        <div v-else-if="store.user" class="flex items-center gap-4">
            <img
            :src="store.user.avatar"
            class="w-16 h-16 rounded-full"
            alt="avatar"
            />

            <div>
                <p class="font-semibold">{{ store.user.name }}</p>
                <p class="text-gray-500 text-sm">{{ store.user.email }}</p>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
    import { onMounted } from 'vue';
    import {useUserStore} from '.../../../stores/userStore'

    const store = useUserStore()

    onMounted(() =>{
        if(!store.user){
            store.fetchUser()
        }
    })
</script>