import { defineNuxtPlugin } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'

declare global {
  interface HTMLElement {
    __clickOutsideHandler__?: EventListener
  }
}

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    beforeMount(el: HTMLElement, binding: any) {
      const handler: EventListener = (event: Event) => {
        const target = event.target as Node
        if (!(el === target || el.contains(target))) {
          binding.value(event)
        }
      }

      el.__clickOutsideHandler__ = handler

      document.addEventListener('click', handler)
    },

    unmounted(el: HTMLElement) {
      if (el.__clickOutsideHandler__) {
        document.removeEventListener('click', el.__clickOutsideHandler__)
      }
    }
  })
})
