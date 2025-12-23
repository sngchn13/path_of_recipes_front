<script setup lang="ts">
import { useMouse } from '@/composables/mouse'

const { x, y } = useMouse()

const props = withDefaults(
  defineProps<{
    visible: boolean
    offsetX?: number
    offsetY?: number
    zIndex?: number
  }>(),
  {
    offsetX: 14, //커서와 겹치지 않게
    offsetY: 14,
    to: '#teleport-destination',
    zIndex: 5000,
  },
)
</script>

<template>
  <div>
    <Teleport to="#teleport-destination">
      <div
        v-if="visible"
        :style="{
          position: 'fixed',
          left: `${x + props.offsetX}px`,
          top: `${y + props.offsetY}px`,
          zIndex: props.zIndex,
          pointerEvents: 'none',
        }"
        aria-hidden="true"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
