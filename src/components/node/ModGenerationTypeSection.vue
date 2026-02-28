<script setup lang="ts">
import type { ModGroup, Mod } from '@/shared/types'
import { computed } from 'vue'
import { getModGenerationTypeLabelKor, SECTION_DISPLAY_ORDER } from '@/utils/mod-utils'
import ModGroupCard from './ModGroupCard.vue'

const props = withDefaults(
  defineProps<{
    modGenerationTypeId: number
    modGroups: ModGroup[]
    showTypeHeader?: boolean
  }>(),
  { showTypeHeader: true },
)

const emit = defineEmits<{
  (e: 'add-mod', mod: Mod, modGroup: ModGroup): void
}>()

const typeLabel = computed(() => {
  return (
    getModGenerationTypeLabelKor(props.modGenerationTypeId) || `Type ${props.modGenerationTypeId}`
  )
})

// 섹션별 그룹화, SECTION_DISPLAY_ORDER 순서 후 나머지 알파벳 순
const modGroupsBySectionOrdered = computed(() => {
  const grouped: Record<string, ModGroup[]> = {}
  for (const group of props.modGroups) {
    const section = group.section?.trim() || 'other'
    if (!grouped[section]) grouped[section] = []
    grouped[section].push(group)
  }
  const orderSet = new Set(SECTION_DISPLAY_ORDER)
  const ordered: Array<{ section: string; groups: ModGroup[] }> = []
  for (const section of SECTION_DISPLAY_ORDER) {
    if (grouped[section]?.length) {
      ordered.push({ section, groups: grouped[section] })
    }
  }
  const rest = Object.keys(grouped)
    .filter((s) => !orderSet.has(s))
    .sort()
  for (const section of rest) {
    ordered.push({ section, groups: grouped[section]! })
  }
  return ordered
})

const handleAddMod = (mod: Mod, modGroup: ModGroup) => {
  emit('add-mod', mod, modGroup)
}
</script>

<template>
  <div class="mod-generation-type-section">
    <div v-if="showTypeHeader" class="section-header">
      <div class="section-label">{{ typeLabel }}</div>
    </div>
    <div class="mod-groups-list">
      <template v-for="(block, blockIndex) in modGroupsBySectionOrdered" :key="block.section">
        <div v-if="blockIndex > 0" class="section-divider" />
        <div class="section-block">
          <div class="section-block-label">{{ block.section }}</div>
          <ModGroupCard
            v-for="group in block.groups"
            :key="group.id"
            :mod-group="group"
            @add-mod="handleAddMod"
          />
        </div>
      </template>
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

.section-divider {
  height: 1px;
  background-color: rgba(148, 163, 184, 0.2);
  margin: 12px 0;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-block-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: capitalize;
}
</style>
