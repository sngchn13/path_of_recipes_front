<script setup lang="ts">
import { NButton, NSpace, NDivider } from 'naive-ui'

const emit = defineEmits<{
  (e: 'create-node'): void
  (e: 'save-graph'): void
  (e: 'load-graph'): void
}>()

const onCreateNodeClick = () => {
  emit('create-node')
}

const onSaveClick = () => {
  emit('save-graph')
}

const onLoadClick = () => {
  emit('load-graph')
}
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px">
    <NSpace align="center" :size="8">
      <NButton type="primary" size="small" @click="onCreateNodeClick"> + 새 노드 </NButton>

      <NButton size="small" secondary @click="onSaveClick"> (placeholder) 그래프 저장 </NButton>

      <NButton size="small" tertiary @click="onLoadClick"> (placeholder) 그래프 불러오기 </NButton>
    </NSpace>

    <NDivider vertical style="margin: 0 12px" />

    <NSpace align="center" :size="8">
      <NButton size="small" tertiary>(placeholder) 줌 리셋</NButton>
      <NButton size="small" tertiary>(placeholder) 전체 보기</NButton>
    </NSpace>
  </div>
</template>

<style scoped></style>
