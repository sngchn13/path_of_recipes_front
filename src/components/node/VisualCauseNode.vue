<script setup lang="ts">
import { computed, ref } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import type { CauseNodeData } from '@/shared/component-types'
import type { Cause } from '@/shared/causes/cause-type'
import { useMouse } from '@/composables/mouse'
import CauseCard from '@/components/common/CauseCard.vue'

const props = defineProps<NodeProps<CauseNodeData>>()
const data = computed(() => props.data)

const hoveredCause = ref<Cause | null>(null)
const { x: mouseX, y: mouseY } = useMouse()

const handleCauseEnter = (cause: Cause) => {
  hoveredCause.value = cause
}

const handleCauseLeave = () => {
  hoveredCause.value = null
}
</script>

<template>
  <div class="visual-cause-node-wrapper">
    <div class="visual-cause-node">
      <Handle type="target" :position="Position.Left" />

      <div class="cause-node-label">
        <img
          v-for="cause in data.causes"
          :key="cause.name"
          :src="cause.image"
          :alt="cause.name"
          class="cause-node-image"
          @mouseenter="handleCauseEnter(cause)"
          @mouseleave="handleCauseLeave"
        />
      </div>

      <Handle type="source" :position="Position.Right" />
    </div>

    <Teleport to="#teleport-destination">
      <div
        v-if="hoveredCause"
        class="cause-card-wrapper"
        :style="{
          position: 'fixed',
          left: `${mouseX + 16}px`,
          top: `${mouseY + 16}px`,
          zIndex: 10000,
          pointerEvents: 'none',
        }"
      >
        <CauseCard :cause="hoveredCause" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.visual-cause-node {
  position: relative;
  padding: 2px 0;
}

.cause-node-label {
  display: flex;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

.cause-node-image {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  object-fit: cover;
}
</style>
