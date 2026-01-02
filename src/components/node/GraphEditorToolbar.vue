<script setup lang="ts">
import { NButton, NSpace, NDivider } from 'naive-ui'

const emit = defineEmits<{
  (e: 'create-node'): void
  (e: 'save-graph'): void
}>()

const onCreateNodeClick = () => {
  emit('create-node')
}

const onSaveClick = () => {
  emit('save-graph')
}
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px">
    <NSpace align="center" :size="8">
      <NButton type="primary" size="small" @click="onCreateNodeClick"> + 새 노드 </NButton>
      <NButton size="small" secondary @click="onSaveClick"> 그래프 저장 </NButton>
    </NSpace>
  </div>
</template>

<style scoped></style>
