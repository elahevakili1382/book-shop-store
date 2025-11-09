<template>
<div class="w-full bg-white rounded-2xl shadow p-4 flex flex-col mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">اعضای مجموعه </h3>
      <button class="flex items-center gap-2 border border-blue-600 text-blue-800 px-4 py-2 rounded-2xl hover:bg-blue-800 hover:text-white transition">
        <FontAwesome :icon="['fas','plus']" class="w-4 h-4" /> جدید
      </button>
    </div>

    <div v-if="loading" class="text-center py-6">در حال بارگذاری...</div>

    <div v-else>
      <div v-if="members.length === 0" class="text-center text-gray-500 py-6">موردی برای نمایش وجود ندارد.</div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="member in members.slice(0, 2)"
          :key="member.id"
          class="flex items-center p-3 rounded-lg hover:shadow gap-2"
        >
          <img :src="member.image" alt="image" class="w-24 h-24 object-cover rounded-full" />
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800">{{ member.name }}</h4>
            <p class="text-sm text-gray-500 line-clamp-3">{{ member.role }}</p>
  


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Member {
  id: string
  name: string
  role: string
  image: string
}
const loading = ref(true)

const members = ref<Member[]>([])
onMounted(async () => {
    try{

          members.value = await $fetch('/api/members')

    } catch(err){
    console.error('خطا در دریافت اعضا:', err)
    } finally{
        loading.value = false
    }
})


</script>
