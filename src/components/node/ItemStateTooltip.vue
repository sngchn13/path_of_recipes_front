<script setup lang="ts">
import type { ItemState, Placement } from '@/shared/types'
import { computed } from 'vue'
import DetailMod from './DetailMod.vue'

const props = defineProps<{
  itemState: ItemState
}>()

// placement 순서: ENCHANTMENT -> IMPLICIT -> EXPLICIT
const placementOrder: Placement[] = ['ENCHANTMENT', 'IMPLICIT', 'EXPLICIT']

const modsByPlacement = computed(() => {
  const grouped: Record<Placement, typeof props.itemState.mods> = {
    ENCHANTMENT: [],
    IMPLICIT: [],
    EXPLICIT: [],
  }

  for (const mod of props.itemState.mods) {
    grouped[mod.placement].push(mod)
  }

  return placementOrder
    .map((placement) => ({
      placement,
      mods: grouped[placement],
    }))
    .filter((group) => group.mods.length > 0)
})
</script>

<template>
  <div class="item-state-tooltip">
    <header class="tooltip-header">
      <div class="tooltip-title">
        {{
          itemState.itemBase.displayKor ?? itemState.itemBase.displayEn ?? itemState.itemBase.name
        }}
      </div>
      <div class="tooltip-meta">
        <span>Lv. {{ itemState.itemLevel }}</span>
      </div>
    </header>

    <div v-if="itemState.note" class="tooltip-note">
      {{ itemState.note }}
    </div>

    <div v-for="(group, index) in modsByPlacement" :key="group.placement" class="placement-group">
      <div v-if="index > 0" class="placement-divider" />
      <div class="placement-header">{{ group.placement }}</div>
      <div class="placement-mods-list">
        <DetailMod v-for="mod in group.mods" :key="mod.id" :mod="mod" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-state-tooltip {
  min-width: 300px;
  max-width: 400px;
  padding: 12px;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  font-size: 12px;
  color: #f9fafb;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.tooltip-title {
  font-weight: 600;
  font-size: 13px;
}

.tooltip-meta {
  font-size: 11px;
  opacity: 0.8;
}

.tooltip-note {
  margin-bottom: 8px;
  padding: 4px 0;
  font-size: 11px;
  color: #d1d5db;
  border-bottom: 1px solid #374151;
}

.placement-group {
  margin-top: 8px;
}

.placement-group:first-child {
  margin-top: 0;
}

.placement-divider {
  height: 1px;
  background-color: #374151;
  margin: 8px 0;
}

.placement-header {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 6px;
  text-transform: capitalize;
}

.placement-mods-list {
  display: flex;
  flex-direction: column;
}
</style>
