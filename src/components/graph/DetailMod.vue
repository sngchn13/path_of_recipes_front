<script setup lang="ts">
import type { AttachedMod } from '@/shared/types'

defineProps<{
  mod: AttachedMod
}>()
</script>

<template>
  <div class="detail-mod">
    <div class="detail-mod-main">
      <span class="detail-mod-type-id">{{ mod.modGenerationTypeId }}</span>
      <span class="detail-mod-display">{{ mod.displayKor }}</span>
    </div>

    <div class="detail-mod-meta">
      <span v-if="mod.nameKor" class="detail-mod-name">{{ mod.nameKor }}</span>
    </div>

    <div class="detail-mod-stats">
      <span>요구 레벨: {{ mod.requiredItemLevel }}</span>
      <span v-if="mod.tier">티어: {{ mod.tier }}</span>
      <span v-if="mod.weight">가중치: {{ mod.weight }}</span>
    </div>

    <div class="detail-mod-tags">
      <span class="detail-mod-label">태그:</span>
      <span v-for="tag in mod.tags" :key="tag" class="detail-mod-tag">{{ tag }}</span>
    </div>

    <div class="detail-mod-families">
      <span class="detail-mod-label">패밀리:</span>
      <span v-for="family in mod.families" :key="family" class="detail-mod-family">{{
        family
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.detail-mod {
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-mod:last-child {
  border-bottom: none;
}

.detail-mod-main {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.detail-mod-type-id {
  color: #9ca3af;
  font-weight: 500;
  font-size: 11px;
}

.detail-mod-display {
  color: #f9fafb;
  font-size: 12px;
}

.detail-mod-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
  color: #d1d5db;
}

.detail-mod-name {
  font-weight: 500;
}

.detail-mod-group {
  color: #9ca3af;
}

.detail-mod-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 10px;
  color: #9ca3af;
}

.detail-mod-tags,
.detail-mod-families,
.detail-mod-section {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-size: 10px;
  color: #9ca3af;
  margin-bottom: 2px;
}

.detail-mod-label {
  font-weight: 500;
  margin-right: 4px;
}

.detail-mod-tag,
.detail-mod-family {
  padding: 1px 4px;
  background-color: rgba(156, 163, 175, 0.2);
  border-radius: 3px;
}
</style>
