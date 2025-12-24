<script setup lang="ts">
import type { Cause } from '@/shared/causes/cause-type'

const props = defineProps<{
  cause: Cause
}>()
</script>

<template>
  <div class="cause-card">
    <div class="cause-card__header">
      <img :src="cause.image" :alt="cause.name" class="cause-card__image" />
      <div class="cause-card__title">
        <div class="cause-card__title-en">{{ cause.display_name_en }}</div>
        <div class="cause-card__title-kor">{{ cause.display_name_kor }}</div>
      </div>
    </div>
    <div class="cause-card__description">
      <div class="cause-card__description-kor">{{ cause.description_kor }}</div>
    </div>
  </div>
</template>

<style scoped>
.cause-card {
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.cause-card__header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.cause-card__image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.cause-card__title {
  flex: 1;
  min-width: 0;
}

.cause-card__title-en {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 4px;
}

.cause-card__title-kor {
  font-size: 14px;
  color: #cbd5e1;
}

.cause-card__description {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cause-card__description-kor {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.6;
  white-space: pre-line;
}
</style>
