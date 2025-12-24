<script setup lang="ts">
import type { NodeCause } from '@/shared/component-types'
import { computed, ref } from 'vue'
import { BezierEdge, EdgeLabelRenderer, type EdgeProps } from '@vue-flow/core'
import { useMouse } from '@/composables/mouse'
import type { Cause } from '@/shared/causes/cause-type'
import CauseCard from '@/components/common/CauseCard.vue'

const props = defineProps<EdgeProps<NodeCause>>()

const labelPosition = computed(() => ({
  x: (props.sourceX + props.targetX) / 2,
  y: (props.sourceY + props.targetY) / 2,
}))

// 마우스 오버 시 카드 표시를 위한 상태
const hoveredCause = ref<Cause | null>(null)
const { x: mouseX, y: mouseY } = useMouse()

const handleCauseMouseEnter = (cause: Cause) => {
  hoveredCause.value = cause
}

const handleCauseMouseLeave = () => {
  hoveredCause.value = null
}
</script>

<template>
  <!-- 원본 베지어 엣지에 색상만 적용 (화살표 제거) -->
  <BezierEdge
    :id="id"
    :source-x="sourceX"
    :source-y="sourceY"
    :target-x="targetX"
    :target-y="targetY"
    :source-position="sourcePosition"
    :target-position="targetPosition"
    :style="{
      strokeWidth: 3,
      stroke: '#f97316',
    }"
  />

  <!-- 엣지 중간에 cause 이미지들을 배치 -->
  <EdgeLabelRenderer v-if="data?.causes?.length">
    <div
      class="cause-edge-label"
      :style="{
        transform: `translate(-50%, -50%) translate(${labelPosition.x}px, ${labelPosition.y}px)`,
      }"
    >
      <div class="cause-edge-label-inner">
        <img
          v-for="cause in data.causes"
          :key="cause.name"
          :src="cause.image"
          :alt="cause.name"
          class="cause-edge-label-image"
          @mouseenter="handleCauseMouseEnter(cause)"
          @mouseleave="handleCauseMouseLeave"
        />
      </div>
    </div>
  </EdgeLabelRenderer>

  <!-- 마우스 오버 시 Cause 카드 표시 -->
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
</template>

<style scoped>
.cause-edge-label {
  position: absolute;
  pointer-events: none;
}

.cause-edge-label-inner {
  display: flex;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

.cause-edge-label-image {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  object-fit: cover;
}
</style>
