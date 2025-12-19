<script setup lang="ts">
import type { ModGroup, Mod } from '@/shared/types'
import { computed } from 'vue'
import { getModGenerationTypeLabelKor } from '@/utils/mod-utils'
import ModGroupCard from './ModGroupCard.vue'

const props = defineProps<{
  modGenerationTypeId: number
  modGroups: ModGroup[]
}>()

const emit = defineEmits<{
  (e: 'add-mod', mod: Mod, modGroup: ModGroup): void
}>()

const typeLabel = computed(() => {
  return (
    getModGenerationTypeLabelKor(props.modGenerationTypeId) || `Type ${props.modGenerationTypeId}`
  )
})

const handleAddMod = (mod: Mod, modGroup: ModGroup) => {
  emit('add-mod', mod, modGroup)
}
</script>

<template>
  <div class="mod-generation-type-section">
    <div class="section-header">
      <div class="section-label">{{ typeLabel }}</div>
    </div>
    <div class="mod-groups-list">
      <ModGroupCard
        v-for="group in modGroups"
        :key="group.id"
        :mod-group="group"
        @add-mod="handleAddMod"
      />
    </div>
  </div>
</template>

<style scoped>
.mod-generation-type-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.section-header {
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  flex-shrink: 0;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mod-groups-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.mod-groups-list::-webkit-scrollbar {
  width: 6px;
}

.mod-groups-list::-webkit-scrollbar-track {
  background: transparent;
}

.mod-groups-list::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.mod-groups-list::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>
