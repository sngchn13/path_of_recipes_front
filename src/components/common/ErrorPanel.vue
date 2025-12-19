<script setup lang="ts">
import { NAlert, NButton } from 'naive-ui'

const props = defineProps<{
  message: string | null | undefined
  showRetry?: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const onRetryClick = () => {
  emit('retry')
}
</script>

<template>
  <div class="error-panel">
    <NAlert type="error" title="에러가 발생했습니다" :closable="false">
      <p class="error-panel__message">
        {{ props.message ?? '알 수 없는 에러가 발생했습니다.' }}
      </p>
      <div v-if="showRetry" class="error-panel__actions">
        <NButton size="small" type="error" quaternary @click="onRetryClick"> 다시 시도 </NButton>
      </div>
    </NAlert>
  </div>
</template>

<style scoped>
.error-panel {
  padding: 12px 0;
}

.error-panel__message {
  margin: 0;
  font-size: 13px;
}

.error-panel__actions {
  margin-top: 8px;
}
</style>
