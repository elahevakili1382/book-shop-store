<template>

<div class="w-full bg-white rounded-2xl shadow p-4 flex flex-col transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">اعضای مجموعه </h3>
      <button @click="openAddModal" class="flex items-center gap-2 border border-blue-600 text-blue-800 px-4 py-2 rounded-2xl hover:bg-blue-800 hover:text-white transition">
       <AppIcon icon="mdi:plus" class="w-4 h-4" /> جدید
      </button>
    </div>

    <div v-if="loading" class="text-center py-6">در حال بارگذاری...</div>

    <div v-else>
      <div v-if="members.length === 0" class="text-center text-gray-500 py-6">موردی برای نمایش وجود ندارد.</div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="member in members.slice(0, 2)"
          :key="member.id"
          class="flex items-center p-3 rounded-lg hover:bg-gray-50 hover:shadow-lg gap-2 transform transition-all duration-300 hover:-translate-y-1"
        >
          <img :src="member.image" alt="image" class="w-24 h-24 object-cover rounded-full" />
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800">{{ member.name }}</h4>
            <p class="text-sm text-gray-500 line-clamp-3">{{ member.role }}</p>
  


          </div>
        </div>
      </div>

      <!-- modal add member -->
  <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">عضو جدید</h3>
        <form @submit.prevent="submitMember" class="space-y-4">
          <input v-model="form.name" type="text" placeholder="نام" class="w-full border rounded px-3 py-2" required />
          <input v-model="form.role" type="text" placeholder="سمت" class="w-full border rounded px-3 py-2" required />
          <input v-model="form.image" type="text" placeholder="آدرس تصویر" class="w-full border rounded px-3 py-2" required />

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="closeAddModal" class="px-4 py-2 rounded-lg bg-gray-200">انصراف</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ذخیره</button>
          </div>
        </form>
      </div>
    </div>



    </div>
  </div>
</template>

<script setup lang="ts">

  import{ref, onMounted} from 'vue'


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

          members.value = await $fetch<Member[]>('/api/members')

    } catch(err){
    console.error('خطا در دریافت اعضا:', err)
    } finally{
        loading.value = false
    }
})

const showAddModal = ref(false)
const form = ref({ name:'', role: '', image: ''})

const openAddModal = () =>{
  showAddModal.value = true
  form.value = {name:'', role:'', image:''}
}

const closeAddModal = () => showAddModal.value = false

const submitMember = () => {
  members.value.push({...form.value, id:Date.now().toString()})
  closeAddModal()
}


</script>
