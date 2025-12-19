<script setup lang="ts">
import type { ItemState, Placement } from '@/shared/types'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import { computed, ref } from 'vue'
import ItemStateTooltip from './ItemStateTooltip.vue'
import PlacementMods from './PlacementMods.vue'
import { NodeToolbar } from '@vue-flow/node-toolbar'

type ItemStateNodeData = ItemState & {
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
}

const props = defineProps<NodeProps<ItemStateNodeData>>()
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

const handleDeleteClick = () => {
  itemState.value.onDelete?.(props.id)
}

const handleDuplicateClick = () => {
  itemState.value.onDuplicate?.(props.id)
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
    <!-- 노드 툴바 -->
    <NodeToolbar :position="Position.Top" :offset="6">
      <div class="node-toolbar">
        <!-- todo pob형태로 바꿔주는 export버튼 만들기 -->
        <button
          class="node-toolbar__btn"
          type="button"
          title="노드 복제"
          @click.stop="handleDuplicateClick"
        >
          ⧉
        </button>
        <button
          class="node-toolbar__btn node-toolbar__btn--danger"
          type="button"
          title="노드 삭제"
          @click.stop="handleDeleteClick"
        >
          ✕
        </button>
      </div>
    </NodeToolbar>

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

.node-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 999px;
  background-color: rgba(15, 23, 42, 0.9);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.6);
}

.node-toolbar__btn {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  background-color: #1f2937;
  color: #e5e7eb;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.node-toolbar__btn:hover {
  background-color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.node-toolbar__btn--danger {
  background-color: #b91c1c;
}

.node-toolbar__btn--danger:hover {
  background-color: #dc2626;
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
