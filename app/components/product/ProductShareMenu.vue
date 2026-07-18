<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      aria-label="اشتراک‌گذاری"
      aria-haspopup="menu"
      :aria-expanded="open"
      class="w-9 h-9 rounded-xl border border-slate/10 bg-white flex items-center justify-center text-slate/55 hover:text-slate hover:border-slate/20 transition-colors"
      @click.stop="toggleMenu"
    >
      <AppIcon icon="mdi:share-variant-outline" class="w-5 h-5" />
    </button>

    <Transition name="share-menu">
      <div
        v-if="open"
        role="menu"
        class="absolute left-0 top-full mt-2 z-50 min-w-[11.5rem] rounded-2xl bg-white border border-slate/10 shadow-card py-1.5 overflow-hidden"
        @click.stop
      >
        <button
          type="button"
          role="menuitem"
          class="share-menu-item"
          @click="shareViaWhatsApp"
        >
          <AppIcon icon="mdi:whatsapp" class="w-5 h-5 text-[#25D366]" />
          واتس‌اپ
        </button>
        <button
          type="button"
          role="menuitem"
          class="share-menu-item"
          @click="shareViaTelegram"
        >
          <AppIcon icon="mdi:telegram" class="w-5 h-5 text-[#0088cc]" />
          تلگرام
        </button>
        <button
          type="button"
          role="menuitem"
          class="share-menu-item"
          @click="copyLink"
        >
          <AppIcon icon="mdi:link-variant" class="w-5 h-5 text-slate/55" />
          کپی لینک
        </button>
        <button
          v-if="canNativeShare"
          type="button"
          role="menuitem"
          class="share-menu-item"
          @click="shareNative"
        >
          <AppIcon icon="mdi:share-outline" class="w-5 h-5 text-slate/55" />
          سایر برنامه‌ها
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  title: string
}>()

const toast = useToast()
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const canNativeShare = ref(false)

function getSharePayload() {
  const url = window.location.href
  const text = `خرید «${props.title}» از Booklett`
  return { url, text }
}

function toggleMenu() {
  open.value = !open.value
}

function closeMenu() {
  open.value = false
}

function onDocumentClick(event: MouseEvent) {
  if (!open.value || !rootRef.value) return
  const target = event.target as Node
  if (!rootRef.value.contains(target)) closeMenu()
}

function shareViaWhatsApp() {
  const { url, text } = getSharePayload()
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
  window.open(waUrl, '_blank', 'noopener,noreferrer')
  closeMenu()
}

function shareViaTelegram() {
  const { url, text } = getSharePayload()
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  window.open(tgUrl, '_blank', 'noopener,noreferrer')
  closeMenu()
}

async function copyLink() {
  const { url } = getSharePayload()
  try {
    await navigator.clipboard.writeText(url)
    toast.success({ message: 'لینک محصول کپی شد', position: 'topRight', timeout: 2400 })
  } catch {
    toast.error({ message: 'کپی لینک انجام نشد', position: 'topRight', timeout: 2400 })
  }
  closeMenu()
}

async function shareNative() {
  const { url, text, title } = { ...getSharePayload(), title: props.title }
  try {
    await navigator.share({ title, text, url })
  } catch {
    /* کاربر share را لغو کرد */
  }
  closeMenu()
}

onMounted(() => {
  canNativeShare.value = typeof navigator !== 'undefined' && !!navigator.share
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.share-menu-item {
  @apply w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate hover:bg-cream/80 transition-colors text-right;
}

.share-menu-enter-active,
.share-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.share-menu-enter-from,
.share-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
