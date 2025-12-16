<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import { VueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import { MiniMap } from '@vue-flow/minimap'

const nodes = ref([{ id: '1', position: { x: 0, y: 0 }, data: { label: '시작 노드' } }])

const edges = ref([])
</script>

<template>
  <div style="width: 100%; height: calc(100vh - 80px)">
    <VueFlow v-model:nodes="nodes" v-model:edges="edges">
      <MiniMap pannable zoomable />
    </VueFlow>
  </div>
</template>

<style scoped></style>
