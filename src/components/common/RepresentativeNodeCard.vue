<script setup lang="ts">
import type { NodeResponse } from '@/shared/response-types'
import { convertNodeResponseToItemState } from '@/shared/response-types'
import type { ItemState, Placement } from '@/shared/types'
import { computed } from 'vue'
import PlacementMods from '@/components/node/PlacementMods.vue'

const props = defineProps<{
  node: NodeResponse
}>()

const itemState = computed<ItemState>(() => convertNodeResponseToItemState(props.node))

// placement 순서: enchantment -> implicit -> explicit
const placementOrder: Placement[] = ['enchantment', 'implicit', 'explicit']

const modsByPlacement = computed(() => {
  const grouped: Record<Placement, typeof itemState.value.mods> = {
    enchantment: [],
    implicit: [],
    explicit: [],
    others: [],
  }

  for (const mod of itemState.value.mods) {
    grouped[mod.placement].push(mod)
  }

  return placementOrder
    .map((placement) => ({
      placement,
      mods: grouped[placement].sort((a, b) => a.mod_generation_type_id - b.mod_generation_type_id),
    }))
    .filter((group) => group.mods.length > 0)
})
</script>

<template>
  <div class="representative-node-card">
    <header class="card-header">
      <div class="card-title">
        {{
          itemState.item_base.display_kor ??
          itemState.item_base.display_en ??
          itemState.item_base.name
        }}
      </div>
      <div class="card-meta">
        <span class="card-rarity" :class="`card-rarity--${itemState.rarity}`">
          {{ itemState.rarity }}
        </span>
        <span class="card-level">Lv. {{ itemState.item_level }}</span>
      </div>
    </header>

    <div v-if="itemState.note" class="card-note">
      {{ itemState.note }}
    </div>

    <div class="card-mods">
      <PlacementMods
        v-for="(group, index) in modsByPlacement"
        :key="group.placement"
        :mods="group.mods"
        :show-divider="index > 0"
      />
    </div>
  </div>
</template>

<style scoped>
.representative-node-card {
  min-width: 280px;
  max-width: 320px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.card-rarity {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: capitalize;
}

.card-rarity--normal {
  background: #f3f4f6;
  color: #6b7280;
}

.card-rarity--magic {
  background: #dbeafe;
  color: #1e40af;
}

.card-rarity--rare {
  background: #fef3c7;
  color: #92400e;
}

.card-level {
  color: #6b7280;
}

.card-note {
  padding: 8px;
  margin-bottom: 12px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 12px;
  color: #6b7280;
  border-left: 3px solid #d1d5db;
}

.card-mods {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* SimpleMod와 PlacementMods의 색상을 화이트 배경에 맞게 오버라이드 */
.card-mods :deep(.mod-display) {
  color: #111827 !important;
}

.card-mods :deep(.placement-divider) {
  background-color: #e5e7eb !important;
}
</style>
