<template>
  <div class="max-w grid grid-cols-1 lg:grid-cols-6 gap-2 p-5 m-1">

    <!-- div2 -->
   <div class="lg:col-span-4 border border-gray-400 rounded-lg p-10 m-5">

    <div class="border-b-2 border-gray-400">
            <h2 class="text-xl font-bold mb-6">اطلاعات ادمین</h2>
    </div>
    <br>

    <div class="grid grid-cols-2 gap-2">

      <!-- name -->
      <div>
      <label class="block text-lg font-semibold mb-4">نام</label>
      <input
        v-model="profile.name"
        type="text"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <!-- last Name -->
    <div>
      <label class="block text-lg font-semibold mb-4">نام خانوادگی</label>
      <input
        v-model="profile.lastname"
        type="text"
        class="w-full border rounded px-3 py-2"
      />
    </div>

      <!-- Email -->
    <div >
      <label class="block text-lg font-semibold mb-4">ایمیل</label>
      <input
        v-model="profile.email"
        type="email"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <!-- phone -->
    <div >
      <label class="block text-lg font-semibold mb-4">تلفن</label>

      <input
        v-model="profile.phone"
        type="tell"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <!-- Role -->
    <div >
      <label class="block text-lg font-semibold mb-4">نقش</label>
   
      <select name="نقش" id="" v-model="profile.role" class="w-full border rounded px-3 py-2"> 
        <option v-for="role in roles" :key="role.name" :value="role.name">{{ role.name }}</option>   
      </select>
     
    </div>
     <!-- Change Password -->
    <div>
      <h3 class="text-lg font-semibold mb-4">تغییر رمز عبور</h3>

      <div class="mb-3">
        <input
          type="password"
          placeholder="رمز عبور فعلی"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div class="mb-3">
        <input
          type="password"
          placeholder="رمز عبور جدید"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div class="mb-4">
        <input
          type="password"
          placeholder="تکرار رمز عبور جدید"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        class="px-4 py-2 border rounded bg-primary hover:bg-primary/70 text-white"
      >
        تغییر رمز عبور
      </button>
    </div>
    
    
    </div>
    
    <!-- Actions -->
     <!-- <div>
       <button
      @click="saveProfile"
      :disabled="loading"
      class="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
    >
      {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
    </button>
    <p
      v-if="success"
      class="text-green-600 mt-4 text-sm"
    >
      اطلاعات با موفقیت ذخیره شد ✅
    </p>
     </div> -->
   

    
  </div>

    <!-- div1 -->
     <div class="lg:col-span-2 border border-gray-400 rounded-lg p-10 m-5">
       <div class="border-b-2 border-gray-400">
            <h2 class="text-xl font-bold mb-6">پروفایل ادمین</h2>
    </div>

    <div class="flex gap-1 m-5">

      <div>
        <img :src="profile.image" alt="" class="w-14 h-14 object-cover rounded-md">
      </div>

      <div>
        <h1 class="text-lg font-semibold">{{ profile.name }}</h1>
        <div class="flex gap-3">
         <button class="text-green-500 font-semibold" @click="emit('update',profile)">Update</button>
          <button class="text-red-500 font-semibold" @click="deleteAvatar">Delete</button>
        </div>

      </div>
    </div>

    <!-- click to upload -->
     <div class="border-2 border-dashed border-[#aaa] p-20 rounded-md cursor-pointer min-h-[200px]" @click="openFilePicker" @dragover.prevent @drop.prevent="onDrop">

    <p class="font-semibold text-lg text-gray-400" v-if="images.length === 0"> <span class="text-lg text-purple-600"> click to upload</span> or drag and drop 
      <p class="font-semibold text-sm text-gray-400 text-center">
        SVG, PNG, JPG
      </p>

      </p>
    <div class="flex flex-wrap gap-10" v-else>
      <div v-for="(img, index) in images" :key="index" class="relative w-[120px] h-[120px]">
        <img class="w-full h-full object-cover" :src="img.preview">
        <button class="absolute top-4 right-4 text-white pointer" @click.stop="removeImage(index)"> ✕ </button>

        <div class="absolute bottom-0 left-0 h-5 w-full bg-[#eeeeee]" v-if="img.progress < 100">
     <div
            class="h-full bg-green-400"
            :style="{ width: img.progress + '%' }"
          ></div>
                </div>
      </div>
    </div>

    <input type="file" ref="fileInput" accept="image/*" multiple hidden @change="onFilesSelected">

     </div>

  </div> 
  </div>
</template>

<script setup lang="ts">
  // چجوری ابدیت و دیلیت رو واکنش گرا کنم ؟ 
  // چجوری گرید بندی اطلاعات ادمین رو ریسپانسیو کنم ؟
  // چرا عکس پروفایل نمیاد ؟ 
  // برای click tp upload drag and drop images چه کنم ؟ 
  // متغیر پروفایل همینجوری حالت استاتیک بریا این نمونه کارن اوکیه یا مهمه که حتما داینامیک باشه برای مصاحبه گرا ؟ 
  //و این قسمت click to upload  رو ریز به ریز فانکشن به فانکشن به من توضیح بده تا کامل بفهمم 
import { reactive, ref } from 'vue'

interface Role{
  name:string
}

export interface AdminProfile {
  id: string
  name: string
  lastname: string
  phone: string
  email: string
  role: string
  image:string
}

interface UploadImage {
  file: File
  preview : string
  progress : number
}
const roles: Role[] = [
{name:'Super Admin'},
    {name:'Admin'},
    {name:'Admin 2'},
    {name:'writer'}
]
const profile = reactive<AdminProfile>({
  id:'1',
  name: 'helen',
  lastname:'mask',
  phone: '09126369195',
  email: 'admin@bookstore.com',
  image:'/images/client3.jpg',
  role:'Admin'
  
})

const loading = ref(false)
const success = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const images = ref<UploadImage[]>([])
const MAX_SIZE = 2 * 1024 * 1024 //2mb

const openFilePicker = () => {
  fileInput.value?.click()
}

const onFilesSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if(!target.files) return
  handleFiles(target.files)
}

const onDrop = (e: DragEvent) => {
  if(!e.dataTransfer) return
  handleFiles(e.dataTransfer.files)
}

const handleFiles = (files: FileList) =>{
  Array.from(files).forEach((file:File) => {
    if(!file.type.startsWith('image/')) return
    if(file.size > MAX_SIZE){
      alert('Image size must be less than 2MB')
      return
    }

    const image:UploadImage = {
      file,
      preview:URL.createObjectURL(file),
      progress:0
    }
 images.value.push(image)
    uploadImage(image)
  })
}

const removeImage = (index: number) => {
  const img = images.value[index]
  if (!img) return

  URL.revokeObjectURL(img.preview)
  images.value.splice(index, 1)
}

const deleteAvatar  = () => {
  profile.image = '/images/client3.jpg'
  images.value = []
  emit('delete', profile.id)
}

const uploadImage = async (image: UploadImage) => {
  const formData = new FormData()
  formData.append('image', image.file)

  const interval = setInterval(() =>{
    if(image.progress >= 100){
      clearInterval(interval)

      profile.image = image.preview
    }else{
      image.progress += 10
    }
  }, 200)

  // await $fetch('/api/upload', {method:'POST', body:formData})

}


const emit = defineEmits<{
  (e:'delete',id:string ): void
  (e:'update', profile:AdminProfile): void

}>()



const saveProfile = async () => {
  loading.value = true
  success.value = false

  try {
    // 🔁 بعداً API واقعی اینجا وصل می‌شه
    await new Promise(resolve => setTimeout(resolve, 1000))
    success.value = true
  } catch (e) {
    alert('خطا در ذخیره اطلاعات')
  } finally {
    loading.value = false
  }
}
</script>