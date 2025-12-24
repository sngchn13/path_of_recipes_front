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
import GraphPostForm from '@/components/editor/GraphPostForm.vue'
import { getPlacementFromModGenerationTypeId } from '@/utils/mod-utils'
import { createUniqueId } from '@/utils/unique-id'
import type { AttachedMod, ItemState, Mod, ModGroup } from '@/shared/types'
import type { Cause } from '@/shared/causes/cause-type'
import type { Node } from '@vue-flow/core'
import CauseEdge from '@/components/edge/CauseEdge.vue'
import { useCauseEdges } from '@/composables/node/cause-edges'

const nodeTypes = {
  itemState: markRaw(ItemStateNode),
}

const edgeTypes = {
  causeEdge: markRaw(CauseEdge),
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

const nodes = ref<Node<ItemState>[]>([])

type CauseEdgeData = { causes?: Cause[] }

const edges = ref<
  Array<{
    id: string
    source: string
    target: string
    type?: string
    data?: CauseEdgeData
  }>
>([])

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

// 게시글 제목과 비밀번호 관리
const postTitle = ref('')
const postPassword = ref('')

const handleClearCauses = () => {
  causes.value = []
}

// cause 관련 엣지 생성/업데이트 로직을 composable 로 분리
const { handleNodeClickForCauses } = useCauseEdges(edges, causes, handleClearCauses)

const handleNodeClick = (event: { node: Node<ItemState> }) => {
  const clickedNodeId = event.node.id

  // 작업대에 선택된 cause 로 a -> b 엣지를 만드는 클릭이라면, 여기서 처리하고 종료
  const handledByCauseEdges = handleNodeClickForCauses(clickedNodeId)
  if (handledByCauseEdges) {
    return
  }

  // cause 가 선택되지 않은 일반 상태에서는 기존처럼 노드 편집 오버레이를 연다
  selectedNode.value = event.node
  showNodeEditOverlay.value = true
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
    <GraphPostForm
      :title="postTitle"
      :password="postPassword"
      @update:title="postTitle = $event"
      @update:password="postPassword = $event"
    />

    <GraphEditorToolbar @create-node="handleCreateNode" />

    <div style="flex: 1; min-height: 0" @contextmenu.prevent="handleClearCauses">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :nodeTypes="nodeTypes"
        :edgeTypes="edgeTypes"
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
