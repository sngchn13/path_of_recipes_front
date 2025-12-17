<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { VueFlow } from '@vue-flow/core'
import { markRaw, ref } from 'vue'
import { MiniMap } from '@vue-flow/minimap'
import GraphEditorToolbar from '@/components/graph/GraphEditorToolbar.vue'
import ItemStateNode from '@/components/graph/ItemStateNode.vue'
import type { AttachedMod, ItemState } from '@/shared/types'

const nodeTypes = {
  itemState: markRaw(ItemStateNode),
}

const modsExample: AttachedMod[] = [
  {
    id: 1,
    nameEn: 'Unassailable',
    nameKor: '빈틈없는',
    displayEn: '(92—100)% increased Energy Shield',
    displayKor: '에너지 보호막 (92-100)% 증가',
    requiredItemLevel: 84,
    weight: 1000,
    tier: 1,
    modGroup: '#% increased Energy Shield',
    modGenerationTypeId: 1,
    tags: ['defences', 'energy_shield'],
    families: ['DefencesPercent'],
    section: 'normal',
    placement: 'EXPLICIT',
  },
  {
    id: 2,
    nameEn: 'Seething',
    nameKor: '끓어오르는',
    displayEn: '+(39—49) to maximum Energy Shield',
    displayKor: '에너지 보호막 최대치 +(39-49)',
    requiredItemLevel: 43,
    weight: 1000,
    tier: 1,
    modGroup: '# to maximum Energy Shield',
    modGenerationTypeId: 1,
    tags: ['defences', 'energy_shield'],
    families: ['BaseLocalDefences'],
    section: 'normal',
    placement: 'EXPLICIT',
  },
  {
    id: 3,
    displayEn: 'Curse Enemies with Despair on Hit',
    displayKor: '명중 시 적이 절망 저주에 걸림',
    requiredItemLevel: 30,
    weight: 1000,
    tier: 1,
    modGroup: 'Curse Enemies with Despair on Hit',
    modGenerationTypeId: 5,
    tags: ['caster', 'curse'],
    families: ['CasterCurse'],
    section: 'vaal',
    placement: 'IMPLICIT',
  },
]

const itemStateExample: ItemState = {
  itemBase: {
    id: 1,
    name: 'warlock gloves',
    displayEn: 'warlock gloves',
    displayKor: '악령술사 장갑',
    itemTypeName: 'gloves_int',
  },
  context: '',
  rarity: 'magic',
  itemLevel: 84,
  note: '아이템레벨 84 이상으로 준비',
  mods: modsExample,
}

const nodes = ref([
  { id: '1', type: 'itemState', position: { x: 0, y: 0 }, data: itemStateExample },
])

const edges = ref([])

const handleCreateNode = () => {
  // TODO: 새 노드 생성 로직은 사용자가 구현
  // 현재는 형태만 보여주기 위해 로그만 출력
  console.log('create-node clicked')
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
  </div>
</template>

<style scoped></style>
