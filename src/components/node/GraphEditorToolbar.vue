<script setup lang="ts">
import { NButton, NSpace, NDivider } from 'naive-ui'

const emit = defineEmits<{
  (e: 'create-node'): void
}>()

const onCreateNodeClick = () => {
  emit('create-node')
}
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px">
    <NSpace align="center" :size="8">
      <NButton type="primary" size="small" @click="onCreateNodeClick"> + 새 노드 </NButton>
    </NSpace>
  </div>
</template>

<style scoped></style>
