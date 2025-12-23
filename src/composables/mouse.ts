import { onMounted, ref } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  onMounted(() => {
    window.addEventListener('mousemove', (event) => {
      x.value = event.clientX
      y.value = event.clientY
    })
  })

  return { x, y }
}
