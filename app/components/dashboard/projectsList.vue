<template>
  <div class="w-full bg-white rounded-2xl shadow p-6 mt-8 flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">پر فروش ترین ها</h3>
      <button class="flex items-center gap-2 border border-blue-600 text-blue-800 px-4 py-2 rounded-2xl hover:bg-blue-800 hover:text-white transition">
        <FontAwesome :icon="['fas','plus']" class="w-4 h-4" /> جدید
      </button>
    </div>

    <div v-if="loading" class="text-center py-6">در حال بارگذاری...</div>

    <div v-else>
      <div v-if="projects.length === 0" class="text-center text-gray-500 py-6">موردی برای نمایش وجود ندارد.</div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="project in projects.slice(0, 2)"
          :key="project.id"
          class="flex items-center p-4 border rounded-lg hover:shadow gap-4"
        >
          <img :src="project.image" alt="image" class="w-24 h-24 object-cover rounded-md" />
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800">{{ project.title }}</h4>
            <p class="text-sm text-gray-500 line-clamp-2">{{ project.description }}</p>
            <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
  <span class="font-bold text-pink-600">${{ project.price }}</span>
  <span class="text-xs px-2 py-1 bg-gray-100 rounded break-words max-w-full">
    {{ project.category }}
  </span>
</div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  id: string
  title: string
  price: number
  description: string
  category: string
  image: string
}

const projects = ref<Book[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
 
    const res = await $fetch<{ works: any[] }>(
      "https://openlibrary.org/subjects/programming.json?limit=10"
    )

    projects.value = res.works
      .filter(w => w.cover_id)
      .slice(0, 3) 
      .map((w, index) => ({
        id: (index + 1).toString(),
        title: w.title,
        description:
          typeof w.description === "string"
            ? w.description
            : w.description?.value || "توضیح موجود نیست",
        price: Math.floor(Math.random() * 200000) + 50000, 
        category: "برنامه‌نویسی",
        image: `https://covers.openlibrary.org/b/id/${w.cover_id}-L.jpg`,
      }))
  } catch (err) {
    console.error("خطا در دریافت کتاب‌ها:", err)
  } finally {
    loading.value = false
  }
})
</script>
