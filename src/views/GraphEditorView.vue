<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { VueFlow } from '@vue-flow/core'
import { computed, markRaw, ref, watch } from 'vue'
import { MiniMap } from '@vue-flow/minimap'
import GraphEditorToolbar from '@/components/node/GraphEditorToolbar.vue'
import VisualItemNode from '@/components/node/VisualItemNode.vue'
import VisualCauseNode from '@/components/node/VisualCauseNode.vue'
import CreateNodeModal from '@/components/node/CreateNodeModal.vue'
import NodeEditOverlay from '@/components/node/NodeEditOverlay.vue'
import CauseFloatingBar from '@/components/node/CauseFloatingBar.vue'
import CauseCursorFollower from '@/components/editor/CauseCursorFollower.vue'
import GraphPostForm from '@/components/editor/GraphPostForm.vue'
import { NAlert, useMessage } from 'naive-ui'
import type { AxiosResponse, HttpStatusCode } from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { getPlacementFromModGenerationTypeId } from '@/utils/mod-utils'
import { createUniqueId } from '@/utils/unique-id'
import { pathOfRecipesApi } from '@/utils/por-api'
import { convertToNewGraph } from '@/composables/graph/graph-converter'
import type {
  AttachedMod,
  ItemState,
  Mod,
  ModGroup,
  Influence,
  Flags,
  Rarity,
} from '@/shared/types'
import type { Cause } from '@/shared/causes/cause-type'
import type { Node } from '@vue-flow/core'
import type { CauseNodeData } from '@/shared/component-types'
import type { NewPost } from '@/shared/request-types'
import type { PostResponse, NodeResponse, EdgeResponse } from '@/shared/response-types'
import { convertNodeResponseToItemState } from '@/shared/response-types'
import VisualCauseEdge from '@/components/edge/VisualCauseEdge.vue'
import { useCauseEdges } from '@/composables/node/cause-edges'
import { orbs } from '@/shared/causes/cause-orb'
import { essences } from '@/shared/causes/cause-essence'
import { fossils } from '@/shared/causes/cause-fossil'
import { horticraftings } from '@/shared/causes/cause-horticrafting'
import { craftingBenches } from '@/shared/causes/cause-crafting-bench'

const nodeTypes = {
  itemState: markRaw(VisualItemNode),
  causeNode: markRaw(VisualCauseNode),
}

const edgeTypes = {
  causeEdge: markRaw(VisualCauseEdge),
}
// 노드 액션 핸들러들 (노드 데이터에서 콜백으로 주입)
const handleNodeDelete = (id: string) => {
  const connectedEdges = edges.value.filter((edge) => edge.source === id || edge.target === id)
  const connectedNodeIds = new Set(
    connectedEdges.map((edge) => (edge.source === id ? edge.target : edge.source)),
  )
  const causeNodeIds = new Set(
    nodes.value
      .filter((node) => node.type === 'causeNode' && connectedNodeIds.has(node.id))
      .map((node) => node.id),
  )

  // 노드 삭제 (연결된 causeNode 포함)
  nodes.value = nodes.value.filter((node) => node.id !== id && !causeNodeIds.has(node.id))
  // 연결된 엣지도 함께 삭제
  edges.value = edges.value.filter(
    (edge) =>
      edge.source !== id &&
      edge.target !== id &&
      !causeNodeIds.has(edge.source) &&
      !causeNodeIds.has(edge.target),
  )
}

const removeCauseNodeAndLinks = (causeNodeId: string) => {
  nodes.value = nodes.value.filter((node) => node.id !== causeNodeId)
  edges.value = edges.value.filter(
    (edge) => edge.source !== causeNodeId && edge.target !== causeNodeId,
  )
}

const handleRemoveCauseEdge = (nodeId: string) => {
  removeCauseNodeAndLinks(nodeId)
}

const handleNodeDuplicate = (id: string) => {
  const original = nodes.value.find((node) => node.id === id)
  if (!original) return

  const newId = createUniqueId('node')
  // x축으로만 우측 이동, y축은 같은 높이 유지, 겹치지 않게 충분한 거리
  const offsetX = 300 // 노드 너비를 고려한 충분한 거리
  const newNode = {
    ...original,
    id: newId,
    position: {
      x: original.position.x + offsetX,
      y: original.position.y, // y축은 같은 높이
    },
  }
  nodes.value.push(newNode)
}

const nodes = ref<Node<ItemState | CauseNodeData>[]>([])

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

const syncCauseNodePositions = () => {
  const itemNodeMap = new Map(
    nodes.value
      .filter((node) => node.type === 'itemState')
      .map((node) => [node.id, node]),
  )
  let updated = false
  const nextNodes = nodes.value.map((node) => {
    if (node.type !== 'causeNode') return node
    const data = node.data as CauseNodeData
    const sourceNode = itemNodeMap.get(data.sourceId)
    const targetNode = itemNodeMap.get(data.targetId)
    if (!sourceNode || !targetNode) return node
    const nextPosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    }
    if (node.position.x !== nextPosition.x || node.position.y !== nextPosition.y) {
      updated = true
      return { ...node, position: nextPosition }
    }
    return node
  })
  if (updated) {
    nodes.value = nextNodes
  }
}

watch(
  nodes,
  () => {
    syncCauseNodePositions()
  },
  { deep: true },
)

const route = useRoute()
const router = useRouter()

// 모든 cause를 하나의 배열로 합치고 name으로 찾을 수 있게 Map 생성
const allCauses = [...orbs, ...essences, ...fossils, ...horticraftings, ...craftingBenches]
const causeMap = new Map<string, Cause>()
allCauses.forEach((cause) => {
  causeMap.set(cause.name, cause)
})

// cause 이름 배열을 Cause 객체 배열로 변환
const convertCauseNamesToCauses = (causeNames: string[]): Cause[] => {
  return causeNames
    .map((name) => causeMap.get(name))
    .filter((cause): cause is Cause => cause !== undefined)
}

// API 응답을 VueFlow 형식으로 변환
const convertPostResponseToVueFlow = (post: PostResponse) => {
  // Nodes 변환
  const vueFlowNodes: Node<ItemState | CauseNodeData>[] = post.graph.nodes.map(
    (node: NodeResponse) => {
    const itemState = convertNodeResponseToItemState(node)
    return {
      id: node.id,
      type: 'itemState',
      position: { x: node.positionX, y: node.positionY },
      data: attachNodeActions(itemState),
    }
    },
  )

  const nodeMap = new Map(vueFlowNodes.map((node) => [node.id, node]))
  const causeNodes: Node<ItemState | CauseNodeData>[] = []
  const linkEdges: Array<{
    id: string
    source: string
    target: string
    type?: string
    data?: CauseEdgeData
  }> = []

  post.graph.edges.forEach((edge: EdgeResponse) => {
    const causes = convertCauseNamesToCauses(edge.causes)
    const sourceNode = nodeMap.get(edge.sourceId)
    const targetNode = nodeMap.get(edge.targetId)
    if (!sourceNode || !targetNode) return
    const midPosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    }
    const causeNodeId = `cause-${edge.id}`
    causeNodes.push({
      id: causeNodeId,
      type: 'causeNode',
      position: midPosition,
      data: {
        causes,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        edgeId: edge.id,
        onRemoveEdge: handleRemoveCauseEdge,
      },
    })
    linkEdges.push({
      id: `edge-link-${edge.id}-source`,
      source: edge.sourceId,
      target: causeNodeId,
      type: 'causeEdge',
    })
    linkEdges.push({
      id: `edge-link-${edge.id}-target`,
      source: causeNodeId,
      target: edge.targetId,
      type: 'causeEdge',
    })
  })

  nodes.value = [...vueFlowNodes, ...causeNodes]
  edges.value = linkEdges
}

// copyFrom 쿼리 파라미터 확인 및 그래프 로드
const copyFromPostId = computed(() => {
  const copyFrom = route.query.copyFrom
  return typeof copyFrom === 'string' ? copyFrom : null
})

if (copyFromPostId.value) {
  // copyFrom이 있으면 해당 postId로 API 요청
  const copyApi = pathOfRecipesApi()
  const copyReactiveAxios = copyApi.get(`/posts/${copyFromPostId.value}`, {}, { immediate: true })

  watch(
    () => copyReactiveAxios.responseData.value,
    (data) => {
      if (data) {
        const post = data as PostResponse
        convertPostResponseToVueFlow(post)
      }
    },
    { immediate: true },
  )
}

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
const selectedNode = ref<Node<ItemState | CauseNodeData> | null>(null)
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
const titleError = ref(false)
const passwordError = ref(false)

// 알림 상태 관리
const showNodeAlert = ref(false)
const message = useMessage()

const getBackendNodes = () =>
  nodes.value.filter((node) => node.type === 'itemState') as Node<ItemState>[]

const getBackendEdges = () =>
  nodes.value
    .filter((node) => node.type === 'causeNode')
    .map((node) => {
      const data = node.data as CauseNodeData
      return {
        id: data.edgeId,
        source: data.sourceId,
        target: data.targetId,
        type: 'causeEdge',
        data: { causes: data.causes },
      }
    })

// 그래프 저장 핸들러
const handleSaveGraph = async () => {
  // 에러 상태 초기화
  titleError.value = false
  passwordError.value = false

  // 제목과 비밀번호 검증
  if (!postTitle.value.trim()) {
    titleError.value = true
    return
  }

  if (!postPassword.value.trim()) {
    passwordError.value = true
    return
  }

  // 노드가 없는지 확인
  if (getBackendNodes().length === 0) {
    showNodeAlert.value = true
    // 3초 후 자동으로 닫기
    setTimeout(() => {
      showNodeAlert.value = false
    }, 3000)
    return
  }

  try {
    // NewPost 생성
    const newGraph = convertToNewGraph(getBackendNodes(), getBackendEdges(), '')
    const newPost: NewPost = {
      title: postTitle.value,
      password: postPassword.value,
      graph: newGraph,
    }
    console.log('newPost:', newPost)

    // 상태코드별 콜백 정의
    const callbacks = new Map<HttpStatusCode, (response: AxiosResponse) => void>([
      [
        201,
        (res) => {
          const postId = (res.data as { post_id?: string }).post_id
          if (postId) {
            router.push(`/posts/${postId}`)
          }
          message.success('그래프가 성공적으로 저장되었습니다.')
        },
      ],
      [
        400,
        () => {
          message.error('그래프 저장에 실패했습니다. 입력 정보를 확인해주세요.')
        },
      ],
    ])

    // API 요청
    const api = pathOfRecipesApi()
    const reactiveAxios = api.post('/posts', {}, { immediate: false, callbacks })
    await reactiveAxios.execute(newPost)
  } catch (error) {
    message.error('그래프 저장 중 오류가 발생했습니다.')
    console.error('Save graph error:', error)
  }
}

const handleClearCauses = () => {
  causes.value = []
}

// cause 관련 엣지 생성/업데이트 로직을 composable 로 분리
const { handleNodeClickForCauses } = useCauseEdges(
  nodes,
  edges,
  causes,
  handleClearCauses,
  handleRemoveCauseEdge,
)

const handleNodeClick = (event: { node: Node<ItemState | CauseNodeData> }) => {
  if (event.node.type === 'causeNode') {
    return
  }
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
  if (!selectedNode.value || selectedNode.value.type !== 'itemState') return null
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
    fractured: false,
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
  if (nodeIndex >= 0 && node.id) {
    const originalNode = nodes.value[nodeIndex]
    if (!originalNode || !originalNode.position) return // 노드가 없거나 position이 없으면 업데이트하지 않음

    const updatedNode = {
      ...originalNode,
      id: node.id, // id를 명시적으로 보장
      position: originalNode.position, // position을 명시적으로 보장
      data: {
        ...updatedData,
        onDelete: currentData.onDelete ?? handleNodeDelete,
        onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
      } as ItemState & {
        onDelete?: (id: string) => void
        onDuplicate?: (id: string) => void
      },
    }
    // VueFlow 반응성을 위해 배열을 새로 만들어서 할당
    nodes.value = [
      ...nodes.value.slice(0, nodeIndex),
      updatedNode,
      ...nodes.value.slice(nodeIndex + 1),
    ]
    // selectedNode도 업데이트하여 오버레이에 반영
    selectedNode.value = updatedNode
  }
}

const handleUpdateModFractured = (modId: number, fractured: boolean) => {
  if (!selectedNode.value) return
  const node = selectedNode.value
  const currentData = node.data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }
  const updatedData: ItemState = {
    ...currentData,
    mods: currentData.mods.map((mod) =>
      mod.id === modId ? { ...mod, fractured } : mod,
    ),
  }
  const nodeIndex = nodes.value.findIndex((n) => n.id === node.id)
  if (nodeIndex >= 0 && node.id) {
    const originalNode = nodes.value[nodeIndex]
    if (!originalNode || !originalNode.position) return
    const updatedNode = {
      ...originalNode,
      id: node.id,
      position: originalNode.position,
      data: {
        ...updatedData,
        onDelete: currentData.onDelete ?? handleNodeDelete,
        onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
      } as ItemState & {
        onDelete?: (id: string) => void
        onDuplicate?: (id: string) => void
      },
    }
    nodes.value = [
      ...nodes.value.slice(0, nodeIndex),
      updatedNode,
      ...nodes.value.slice(nodeIndex + 1),
    ]
    selectedNode.value = updatedNode
  }
}

const handleRemoveMod = (modId: number) => {
  if (!selectedNode.value) return

  // 선택된 노드의 현재 데이터 가져오기
  const node = selectedNode.value
  const currentData = node.data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }

  // modId에 해당하는 모드 제거
  const updatedData: ItemState = {
    ...currentData,
    mods: currentData.mods.filter((mod) => mod.id !== modId),
  }

  // 노드 업데이트
  const nodeIndex = nodes.value.findIndex((n) => n.id === node.id)
  if (nodeIndex >= 0 && node.id) {
    const originalNode = nodes.value[nodeIndex]
    if (!originalNode || !originalNode.position) return // 노드가 없거나 position이 없으면 업데이트하지 않음

    const updatedNode = {
      ...originalNode,
      id: node.id, // id를 명시적으로 보장
      position: originalNode.position, // position을 명시적으로 보장
      data: {
        ...updatedData,
        onDelete: currentData.onDelete ?? handleNodeDelete,
        onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
      } as ItemState & {
        onDelete?: (id: string) => void
        onDuplicate?: (id: string) => void
      },
    }
    // VueFlow 반응성을 위해 배열을 새로 만들어서 할당
    nodes.value = [
      ...nodes.value.slice(0, nodeIndex),
      updatedNode,
      ...nodes.value.slice(nodeIndex + 1),
    ]
    // selectedNode도 업데이트하여 오버레이에 반영
    selectedNode.value = updatedNode
  }
}

const handleDeleteNodeFromOverlay = () => {
  if (!selectedNode.value) return
  handleNodeDelete(selectedNode.value.id)
  handleCloseOverlay()
}

const handleUpdateInfluences = (influences: Influence[]) => {
  if (!selectedNode.value) return
  const node = selectedNode.value
  const currentData = node.data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }
  const updatedData: ItemState = { ...currentData, influences: [...influences] }
  const nodeIndex = nodes.value.findIndex((n) => n.id === node.id)
  if (nodeIndex < 0 || !node.id) return
  const originalNode = nodes.value[nodeIndex]
  if (!originalNode?.position) return
  const updatedNode = {
    ...originalNode,
    id: node.id,
    position: originalNode.position,
    data: {
      ...updatedData,
      onDelete: currentData.onDelete ?? handleNodeDelete,
      onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
    } as ItemState & {
      onDelete?: (id: string) => void
      onDuplicate?: (id: string) => void
    },
  }
  nodes.value = [
    ...nodes.value.slice(0, nodeIndex),
    updatedNode,
    ...nodes.value.slice(nodeIndex + 1),
  ]
  selectedNode.value = updatedNode
}

const handleUpdateFlags = (flags: Flags) => {
  if (!selectedNode.value) return
  const node = selectedNode.value
  const currentData = node.data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }
  const updatedData: ItemState = { ...currentData, flags: { ...flags } }
  const nodeIndex = nodes.value.findIndex((n) => n.id === node.id)
  if (nodeIndex < 0 || !node.id) return
  const originalNode = nodes.value[nodeIndex]
  if (!originalNode?.position) return
  const updatedNode = {
    ...originalNode,
    id: node.id,
    position: originalNode.position,
    data: {
      ...updatedData,
      onDelete: currentData.onDelete ?? handleNodeDelete,
      onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
    } as ItemState & {
      onDelete?: (id: string) => void
      onDuplicate?: (id: string) => void
    },
  }
  nodes.value = [
    ...nodes.value.slice(0, nodeIndex),
    updatedNode,
    ...nodes.value.slice(nodeIndex + 1),
  ]
  selectedNode.value = updatedNode
}

const handleUpdateRarity = (rarity: Rarity) => {
  if (!selectedNode.value) return
  const node = selectedNode.value
  const currentData = node.data as ItemState & {
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
  }
  const updatedData: ItemState = { ...currentData, rarity }
  const nodeIndex = nodes.value.findIndex((n) => n.id === node.id)
  if (nodeIndex < 0 || !node.id) return
  const originalNode = nodes.value[nodeIndex]
  if (!originalNode?.position) return
  const updatedNode = {
    ...originalNode,
    id: node.id,
    position: originalNode.position,
    data: {
      ...updatedData,
      onDelete: currentData.onDelete ?? handleNodeDelete,
      onDuplicate: currentData.onDuplicate ?? handleNodeDuplicate,
    } as ItemState & {
      onDelete?: (id: string) => void
      onDuplicate?: (id: string) => void
    },
  }
  nodes.value = [
    ...nodes.value.slice(0, nodeIndex),
    updatedNode,
    ...nodes.value.slice(nodeIndex + 1),
  ]
  selectedNode.value = updatedNode
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
      :title-error="titleError"
      :password-error="passwordError"
      @update:title="postTitle = $event"
      @update:password="postPassword = $event"
    />

    <NAlert
      v-if="showNodeAlert"
      type="warning"
      title="경고"
      style="margin-bottom: 8px"
      closable
      @close="showNodeAlert = false"
    >
      노드가 없습니다. 최소 하나의 노드를 추가해주세요.
    </NAlert>

    <GraphEditorToolbar @create-node="handleCreateNode" @save-graph="handleSaveGraph" />

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
    <CauseFloatingBar :causes="causes" @select-cause="handleSelectCause" @clear="handleClearCauses" />

    <!-- 작업대에서 선택한 cause가 마우스를 따라다니는 컴포넌트 -->
    <CauseCursorFollower :causes="causes" @clear="handleClearCauses" />

    <NodeEditOverlay
      :show="showNodeEditOverlay"
      :item-state="selectedItemState"
      @close="handleCloseOverlay"
      @add-mod="handleAddMod"
      @remove-mod="handleRemoveMod"
      @delete-node="handleDeleteNodeFromOverlay"
      @update-influences="handleUpdateInfluences"
      @update-flags="handleUpdateFlags"
      @update-rarity="handleUpdateRarity"
      @update-mod-fractured="handleUpdateModFractured"
    />

    <CreateNodeModal
      :show="showCreateNodeModal"
      @update:show="showCreateNodeModal = $event"
      @create="handleNodeCreated"
    />
  </div>
</template>

<style scoped></style>
