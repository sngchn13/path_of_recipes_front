<script setup lang="ts">
import { computed, ref } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
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

const handleRemoveEdge = () => {
  data.value.onRemoveEdge?.(props.id)
}
</script>

<template>
  <div class="visual-cause-node-wrapper">
    <NodeToolbar :position="Position.Top" :offset="4">
      <div class="node-toolbar">
        <button
          v-if="data.onRemoveEdge"
          class="node-toolbar__btn node-toolbar__btn--danger"
          type="button"
          title="엣지 삭제"
          @click.stop="handleRemoveEdge"
        >
          ✕
        </button>
      </div>
    </NodeToolbar>

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

.node-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 999px;
  background-color: rgba(15, 23, 42, 0.9);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.6);
}

.node-toolbar__btn {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  background-color: #b91c1c;
  color: #fee2e2;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.node-toolbar__btn:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.node-toolbar__btn--danger {
  background-color: #b91c1c;
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
