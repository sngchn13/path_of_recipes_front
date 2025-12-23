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
}

.section-header {
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
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
}
</style>
