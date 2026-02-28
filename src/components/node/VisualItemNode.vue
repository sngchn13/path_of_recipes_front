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

// 영향력: 상단에 배지로 표시 (첫 번째 사진 스타일)
const activeInfluences = computed(() => itemState.value.influences ?? [])

// 플래그: 하단 구분선 아래 텍스트로 표시 (두 번째 사진 스타일)
const activeFlags = computed(() => {
  const flags = itemState.value.flags
  if (!flags) return []
  const labels: { key: string; label: string }[] = []
  if (flags.corrupted) labels.push({ key: 'corrupted', label: '타락됨' })
  if (flags.mirrored) labels.push({ key: 'mirrored', label: '투영됨' })
  if (flags.split) labels.push({ key: 'split', label: '분할됨' })
  return labels
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

    <Handle type="target" :position="Position.Top" />

    <div
      class="item-card"
      :class="[`item-card--${itemState.rarity}`]"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <!-- 영향력: 상단 모서리 느낌의 배지 (첫 번째 사진 스타일) -->
      <div v-if="activeInfluences.length > 0" class="influences-row">
        <span
          v-for="inf in activeInfluences"
          :key="inf"
          class="influence-badge"
          :class="`influence-badge--${inf}`"
        >
          {{ inf }}
        </span>
      </div>

      <div class="placement-mods-container">
        <PlacementMods
          v-for="(group, index) in modsByPlacement"
          :key="group.placement"
          :mods="group.mods"
          :show-divider="index > 0"
        />
      </div>

      <!-- 플래그: 하단 구분선 아래 텍스트 (두 번째 사진 스타일) -->
      <template v-if="activeFlags.length > 0">
        <div class="flags-divider" />
        <div class="flags-row">
          <span
            v-for="f in activeFlags"
            :key="f.key"
            class="flag-label"
          >
            {{ f.label }}
          </span>
        </div>
      </template>
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

    <Handle type="source" :position="Position.Bottom" />
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

/* 영향력: 상단 배지 (첫 번째 사진 장식 문양 느낌) */
.influences-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.influence-badge {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: capitalize;
  letter-spacing: 0.02em;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.item-card--normal .influence-badge { background: rgba(0, 0, 0, 0.15); color: #374151; }
.item-card--magic .influence-badge { background: rgba(255, 255, 255, 0.15); color: #e0e7ff; }
.item-card--rare .influence-badge { background: rgba(0, 0, 0, 0.25); color: #fef3c7; }

.influence-badge--elder { border-color: rgba(139, 92, 246, 0.6); color: #c4b5fd; }
.influence-badge--shaper { border-color: rgba(59, 130, 246, 0.6); color: #93c5fd; }
.influence-badge--warlord { border-color: rgba(234, 88, 12, 0.6); color: #fdba74; }
.influence-badge--crusader { border-color: rgba(251, 191, 36, 0.6); color: #fde68a; }
.influence-badge--redeemer { border-color: rgba(34, 211, 238, 0.6); color: #67e8f9; }
.influence-badge--hunter { border-color: rgba(34, 197, 94, 0.6); color: #86efac; }

.placement-mods-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 플래그: 하단 구분선 + 텍스트 (두 번째 사진 스타일) */
.flags-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  margin: 6px 0 4px;
}

.item-card--normal .flags-divider {
  background: rgba(0, 0, 0, 0.2);
}

.flags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
}

.item-card--normal .flags-row {
  color: #374151;
}

.flag-label {
  font-weight: 500;
}

.tooltip-container {
  pointer-events: none;
}
</style>
