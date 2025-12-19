<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { VueFlow } from '@vue-flow/core'
import { markRaw, ref } from 'vue'
import { MiniMap } from '@vue-flow/minimap'
import GraphEditorToolbar from '@/components/node/GraphEditorToolbar.vue'
import ItemStateNode from '@/components/node/ItemStateNode.vue'
import CreateNodeModal from '@/components/node/CreateNodeModal.vue'
import { createUniqueId } from '@/utils/unique-id'
import type { AttachedMod, ItemState } from '@/shared/types'

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
</script>

<template>
  <div
    style="width: 100%; height: calc(100vh - 80px); display: flex; flex-direction: column; gap: 8px"
  >
    <GraphEditorToolbar @create-node="handleCreateNode" />

    <div style="flex: 1; min-height: 0">
      <VueFlow v-model:nodes="nodes" v-model:edges="edges" :nodeTypes="nodeTypes">
        <MiniMap pannable zoomable />
      </VueFlow>
    </div>

    <CreateNodeModal
      :show="showCreateNodeModal"
      @update:show="showCreateNodeModal = $event"
      @create="handleNodeCreated"
    />
  </div>
</template>

<style scoped></style>
