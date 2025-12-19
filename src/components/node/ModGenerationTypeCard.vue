<script setup lang="ts">
import type { Mod, ModGroup } from '@/shared/types'
import { getModGenerationTypeLabelKor } from '@/utils/mod-utils'
import { computed } from 'vue'

const props = defineProps<{
  modGenerationTypeId: number
  mods: Mod[]
  modGroup: ModGroup
}>()

const emit = defineEmits<{
  (e: 'add-mod', mod: Mod, modGroup: ModGroup): void
}>()

// 티어 내림차순 정렬
const sortedMods = computed(() => {
  const mods = [...props.mods]
  return mods.sort((a, b) => {
    if (a.tier === null && b.tier === null) return 0
    if (a.tier === null) return 1
    if (b.tier === null) return -1
    return b.tier - a.tier
  })
})

const handleAddMod = (mod: Mod) => {
  emit('add-mod', mod, props.modGroup)
}

const typeLabel = computed(() => {
  return (
    getModGenerationTypeLabelKor(props.modGenerationTypeId) || `Type ${props.modGenerationTypeId}`
  )
})
</script>

<template>
  <div class="mod-generation-type-card">
    <div class="card-header">
      <div class="card-title">{{ typeLabel }}</div>
      <div class="card-count">{{ sortedMods.length }}개</div>
    </div>
    <div class="mod-list">
      <div v-for="mod in sortedMods" :key="mod.id" class="mod-item">
        <div class="mod-content">
          <div class="mod-header">
            <div class="mod-name">
              {{ mod.name_kor || mod.name_en || 'Unnamed' }}
              <span v-if="mod.name_kor && mod.name_en" class="mod-name-en">
                ({{ mod.name_en }})
              </span>
            </div>
            <div class="mod-tier">
              <span v-if="mod.tier">T{{ mod.tier }}</span>
              <span v-else class="no-tier">No Tier</span>
            </div>
          </div>
          <div class="mod-text">{{ mod.display_kor || mod.display_en }}</div>
          <div class="mod-meta">
            <span>요구 iLvl {{ mod.req_item_level }}</span>
            <span v-if="mod.weight">weight {{ mod.weight }}</span>
          </div>
        </div>
        <button class="mod-add-btn" type="button" @click="handleAddMod(mod)" title="추가">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mod-generation-type-card {
  border-radius: 6px;
  border: 1px solid rgba(31, 41, 55, 1);
  background: rgba(15, 23, 42, 0.9);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-header {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(31, 41, 55, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.95);
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: #e5e7eb;
}

.card-count {
  font-size: 11px;
  color: #9ca3af;
}

.mod-list {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
}

.mod-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(31, 41, 55, 0.5);
  transition: background-color 0.15s ease;
}

.mod-item:last-child {
  border-bottom: none;
}

.mod-item:hover {
  background: rgba(31, 41, 55, 0.5);
}

.mod-content {
  flex: 1;
  min-width: 0;
}

.mod-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.mod-name {
  font-weight: 600;
  color: #e5e7eb;
  font-size: 12px;
}

.mod-name-en {
  font-weight: 400;
  color: #9ca3af;
  font-size: 11px;
}

.mod-tier {
  font-size: 11px;
  color: #a5b4fc;
  font-weight: 500;
  flex-shrink: 0;
}

.no-tier {
  color: #6b7280;
}

.mod-text {
  font-size: 12px;
  color: #e5e7eb;
  margin-bottom: 4px;
  line-height: 1.4;
}

.mod-meta {
  font-size: 10px;
  color: #9ca3af;
  display: flex;
  gap: 8px;
}

.mod-add-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.5);
  background: rgba(30, 64, 175, 0.25);
  color: #60a5fa;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
  padding: 0;
  line-height: 1;
}

.mod-add-btn:hover {
  background: rgba(30, 64, 175, 0.4);
  border-color: rgba(59, 130, 246, 0.7);
  transform: scale(1.05);
}
</style>
