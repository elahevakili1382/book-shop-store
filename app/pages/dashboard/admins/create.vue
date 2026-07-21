<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminStore = useAdminStore()

const name = ref('')
const email = ref('')
const role = ref<'admin' | 'editor'>('admin')

const handleSubmit = () => {
  if (!name.value.trim() || !email.value.trim()) return

  adminStore.addAdmin({
    id: Date.now(),
    name: name.value.trim(),
    email: email.value.trim(),
    role: role.value,
  })

  router.push('/dashboard/admins')
}


</script>

<template>
  <div class="max-w-md">
    <h1 class="text-xl font-bold mb-6">افزودن ادمین جدید</h1>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">نام</label>
        <input v-model="name" type="text" required class="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">ایمیل</label>
        <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">نقش</label>
        <select v-model="role" class="w-full px-3 py-2 border rounded-lg">
          <option value="admin">admin</option>
          <option value="editor">editor</option>
        </select>
      </div>

      <button type="submit" class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
        ذخیره
      </button>
    </form>
  </div>
</template>
