<script setup lang="ts">
import { NSpin } from 'naive-ui'
import { ref } from 'vue'

const MESSAGES = [
  '생기 캐는 중...', //todo 힐록런 중으로 통일하고 낮은 확률로 우버힐록 발견으로 할까?
  '힐록런 중...',
  '카드깡 하는 중...',
  '우버 힐록 발견!!',
  '광산 탐험 중...',
] as const

const message = ref(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
</script>

<template>
  <div class="loading-panel">
    <NSpin size="large" />
    <p class="loading-panel__message">{{ message }}</p>
  </div>
</template>

<style scoped>
.loading-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  gap: 12px;
}

.loading-panel__message {
  font-size: 13px;
  color: #6b7280;
}
</style>
