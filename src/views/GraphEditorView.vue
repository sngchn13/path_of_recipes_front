<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { VueFlow } from '@vue-flow/core'
import { computed, markRaw, ref } from 'vue'
import { MiniMap } from '@vue-flow/minimap'
import GraphEditorToolbar from '@/components/node/GraphEditorToolbar.vue'
import ItemStateNode from '@/components/node/ItemStateNode.vue'
import CreateNodeModal from '@/components/node/CreateNodeModal.vue'
import NodeEditOverlay from '@/components/node/NodeEditOverlay.vue'
import CauseFloatingBar from '@/components/node/CauseFloatingBar.vue'
import CauseCursorFollower from '@/components/editor/CauseCursorFollower.vue'
import { createUniqueId } from '@/utils/unique-id'
import { getPlacementFromModGenerationTypeId } from '@/utils/mod-utils'
import type { AttachedMod, ItemState, Mod, ModGroup } from '@/shared/types'
import type { Cause } from '@/shared/causes/cause-type'
import type { Node } from '@vue-flow/core'

const nodeTypes = {
  itemState: markRaw(ItemStateNode),
}

const modsExample: AttachedMod[] = [
  {
    id: 1,
    name_en: 'Unassailable',
    name_kor: '빈틈없는',
    display_en: '(92—100)% increased Energy Shield',
    display_kor: '에너지 보호막 (92-100)% 증가',
    required_item_level: 84,
    weight: 1000,
    tier: 1,
    mod_group: '#% increased Energy Shield',
    mod_generation_type_id: 1,
    tags: ['defences', 'energy_shield'],
    families: ['DefencesPercent'],
    section: 'normal',
    placement: 'EXPLICIT',
  },
  {
    id: 2,
    name_en: 'Seething',
    name_kor: '끓어오르는',
    display_en: '+(39—49) to maximum Energy Shield',
    display_kor: '에너지 보호막 최대치 +(39-49)',
    required_item_level: 43,
    weight: 1000,
    tier: 1,
    mod_group: '# to maximum Energy Shield',
    mod_generation_type_id: 1,
    tags: ['defences', 'energy_shield'],
    families: ['BaseLocalDefences'],
    section: 'normal',
    placement: 'EXPLICIT',
  },
  {
    id: 3,
    display_en: 'Curse Enemies with Despair on Hit',
    display_kor: '명중 시 적이 절망 저주에 걸림',
    required_item_level: 30,
    weight: 1000,
    tier: 1,
    mod_group: 'Curse Enemies with Despair on Hit',
    mod_generation_type_id: 5,
    tags: ['caster', 'curse'],
    families: ['CasterCurse'],
    section: 'vaal',
    placement: 'IMPLICIT',
  },
]

const itemStateExample: ItemState = {
  item_base: {
    id: 1,
    name: 'warlock gloves',
    display_en: 'warlock gloves',
    display_kor: '악령술사 장갑',
    item_type_name: 'gloves_int',
  },
  context: '',
  rarity: 'magic',
  item_level: 84,
  note: '아이템레벨 84 이상으로 준비',
  mods: modsExample,
}

// 노드 액션 핸들러들 (노드 데이터에서 콜백으로 주입)
const handleNodeDelete = (id: string) => {
  nodes.value = nodes.value.filter((node) => node.id !== id)
}

const handleNodeDuplicate = (id: string) => {
  const original = nodes.value.find((node) => node.id === id)
  if (!original) return

  const newId = createUniqueId('node')
  const offset = 40
  const newNode = {
    ...original,
    id: newId,
    position: {
      x: original.position.x + offset,
      y: original.position.y + offset,
    },
  }
  nodes.value.push(newNode)
}

const nodes = ref([
  {
    id: createUniqueId('node'),
    type: 'itemState',
    position: { x: 0, y: 0 },
    data: {
      ...itemStateExample,
      onDelete: handleNodeDelete,
      onDuplicate: handleNodeDuplicate,
    },
  },
])

const edges = ref([])

// CreateNodeModal 상태 관리
const showCreateNodeModal = ref(false)

const handleCreateNode = () => {
  showCreateNodeModal.value = true
}

const attachNodeActions = (itemState: ItemState) => {
  return {
    ...itemState,
    onDelete: handleNodeDelete,
    onDuplicate: handleNodeDuplicate,
  }
}

const handleNodeCreated = (itemState: ItemState) => {
  const newNodeId = createUniqueId('node')
  const newNode = {
    id: newNodeId,
    type: 'itemState' as const,
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: attachNodeActions(itemState),
  }
  nodes.value.push(newNode)
}

// 노드 편집 오버레이 상태 관리
const selectedNode = ref<Node<ItemState> | null>(null)
const showNodeEditOverlay = ref(false)

// 작업대에서 선택한 cause들을 관리하는 배열
const causes = ref<Cause[]>([])

// 작업대에서 cause를 클릭하면 배열의 마지막 요소로 추가
const handleSelectCause = (cause: Cause) => {
  causes.value.push(cause)
}

const handleClearCauses = () => {
  causes.value = []
}

const handleNodeClick = (event: { node: Node<ItemState> }) => {
  selectedNode.value = event.node
  showNodeEditOverlay.value = true
  // 노드 클릭 시 선택된 cause들을 비움
  handleClearCauses()
}

const handleCloseOverlay = () => {
  showNodeEditOverlay.value = false
  selectedNode.value = null
}

const selectedItemState = computed<ItemState | null>(() => {
  if (!selectedNode.value) return null
  // ItemState만 추출 (onDelete, onDuplicate 같은 콜백 제외)
  const data = selectedNode.value.data
  if (!data) return null

  const extendedData = data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDelete, onDuplicate, ...itemState } = extendedData
  return itemState as ItemState
})

// Mod를 AttachedMod로 변환
const convertModToAttachedMod = (mod: Mod, modGroup: ModGroup): AttachedMod => {
  return {
    id: mod.id,
    name_en: mod.name_en || undefined,
    name_kor: mod.name_kor || undefined,
    display_en: mod.display_en,
    display_kor: mod.display_kor,
    required_item_level: mod.req_item_level,
    weight: mod.weight || undefined,
    tier: mod.tier || undefined,
    mod_group: modGroup.value,
    mod_generation_type_id: modGroup.mod_generation_type_id,
    tags: modGroup.tags,
    families: modGroup.families,
    section: modGroup.section,
    placement: getPlacementFromModGenerationTypeId(modGroup.mod_generation_type_id),
  }
}

const handleAddMod = (mod: Mod, modGroup: ModGroup) => {
  if (!selectedNode.value) return

  // 선택된 노드의 현재 데이터 가져오기
  const node = selectedNode.value
  const currentData = node.data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }

  // Mod를 AttachedMod로 변환
  const attachedMod = convertModToAttachedMod(mod, modGroup)

  // 노드의 mods에 추가
  const updatedData: ItemState = {
    ...currentData,
    mods: [...currentData.mods, attachedMod],
  }

  // 노드 업데이트
  const nodeIndex = nodes.value.findIndex((n) => n.id === node.id)
  if (nodeIndex >= 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(nodes.value[nodeIndex] as any).data = {
      ...updatedData,
      onDelete: currentData.onDelete ?? handleNodeDelete,
      onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
    }
  }
}
</script>

<template>
  <div
    style="
      width: 100%;
      height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
    "
  >
    <GraphEditorToolbar @create-node="handleCreateNode" />

    <div style="flex: 1; min-height: 0" @contextmenu.prevent="handleClearCauses">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :nodeTypes="nodeTypes"
        @node-click="handleNodeClick"
      >
        <MiniMap pannable zoomable />
      </VueFlow>
    </div>

    <!-- VueFlow 노드에 영향을 줄 예정인 좌측 플로팅 바 (현재는 플레이스홀더 UI만) -->
    <CauseFloatingBar @select-cause="handleSelectCause" />

    <!-- 작업대에서 선택한 cause가 마우스를 따라다니는 컴포넌트 -->
    <CauseCursorFollower :causes="causes" @clear="handleClearCauses" />

    <NodeEditOverlay
      :show="showNodeEditOverlay"
      :item-state="selectedItemState"
      @close="handleCloseOverlay"
      @add-mod="handleAddMod"
    />

    <CreateNodeModal
      :show="showCreateNodeModal"
      @update:show="showCreateNodeModal = $event"
      @create="handleNodeCreated"
    />
  </div>
</template>

<style scoped></style>
