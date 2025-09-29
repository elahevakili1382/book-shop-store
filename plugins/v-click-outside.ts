export default {
  beforeMount(el: any, binding: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener("click", el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener("click", el.clickOutsideEvent)
  },
}
