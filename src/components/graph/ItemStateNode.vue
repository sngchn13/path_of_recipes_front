<script setup lang="ts">
import type { ItemState, Placement } from '@/shared/types'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import { computed, ref } from 'vue'
import ItemStateTooltip from './ItemStateTooltip.vue'
import PlacementMods from './PlacementMods.vue'

const props = defineProps<NodeProps<ItemState>>()
const itemState = computed(() => props.data)

const showTooltip = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })

const onMouseEnter = (event: MouseEvent) => {
  showTooltip.value = true
  tooltipPosition.value = { x: event.clientX, y: event.clientY }
}

const onMouseMove = (event: MouseEvent) => {
  if (showTooltip.value) {
    tooltipPosition.value = { x: event.clientX + 10, y: event.clientY + 10 }
  }
}

const onMouseLeave = () => {
  showTooltip.value = false
}

// placement 순서: ENCHANTMENT -> IMPLICIT -> EXPLICIT
const placementOrder: Placement[] = ['ENCHANTMENT', 'IMPLICIT', 'EXPLICIT']

const modsByPlacement = computed(() => {
  const grouped: Record<Placement, typeof itemState.value.mods> = {
    ENCHANTMENT: [],
    IMPLICIT: [],
    EXPLICIT: [],
  }

  for (const mod of itemState.value.mods) {
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
  <div class="item-state-node">
    <Handle type="target" :position="Position.Left" />

    <div
      class="item-card"
      :class="[`item-card--${itemState.rarity}`]"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <div class="placement-mods-container">
        <PlacementMods
          v-for="(group, index) in modsByPlacement"
          :key="group.placement"
          :mods="group.mods"
          :show-divider="index > 0"
        />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showTooltip"
        class="tooltip-container"
        :style="{
          position: 'fixed',
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          zIndex: 1000,
        }"
      >
        <ItemStateTooltip :item-state="itemState" />
      </div>
    </Teleport>

    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.item-state-node {
  position: relative;
  padding: 4px 0;
}

.item-card {
  min-width: 220px;
  max-width: 280px;
  padding: 8px 10px;
  border-radius: 6px;
  color: #f9fafb;
  box-shadow: 0 1px 3px rgba(15, 18, 25, 0.55);
  font-size: 12px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  cursor: pointer;
}

/* 레어리티별 배경색 (Path of Exile 스타일) */
.item-card--normal {
  background-color: #c8c8c8;
}

.item-card--magic {
  background-color: #5858b8;
}

.item-card--rare {
  background-color: #ffaa32;
}

.placement-mods-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tooltip-container {
  pointer-events: none;
}
</style>
