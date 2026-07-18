<template>
    <div v-if="loading">در حال بارگذاری...</div>
    <table v-else class="w-full border rounded">
        <thead class="bg-gray-100">
            <tr>
                <th class="p-2 text-left">نام</th>
                <th class="p-2 text-left">ایمیل</th>
                <th class="p-2 text-left">نقش</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="admin in admins" :key="admin.id" class="border-t">
                <td class="p-2">{{ admin.name }}</td>
                <td class="p-2">{{ admin.email }}</td>
                <td class="p-2 capitalize" >{{ admin.role }}</td>

            </tr>
        </tbody>
    </table>
</template>
<script lang="ts" setup>
    defineProps<{
        admins: Admin[]
        loading: boolean
    }>()
</script>