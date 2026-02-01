<script setup lang="ts">
import { BezierEdge, type EdgeProps } from '@vue-flow/core'

defineProps<EdgeProps>()
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

</template>

<style scoped></style>
