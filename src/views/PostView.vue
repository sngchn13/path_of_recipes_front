<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { VueFlow } from '@vue-flow/core'
import { computed, markRaw, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MiniMap } from '@vue-flow/minimap'
import { pathOfRecipesApi } from '@/utils/por-api'
import VisualItemNode from '@/components/node/VisualItemNode.vue'
import VisualCauseNode from '@/components/node/VisualCauseNode.vue'
import VisualCauseEdge from '@/components/edge/VisualCauseEdge.vue'
import type { PostResponse, NodeResponse, EdgeResponse } from '@/shared/response-types'
import { convertNodeResponseToItemState } from '@/shared/response-types'
import type { ItemState } from '@/shared/types'
import type { Node } from '@vue-flow/core'
import type { Cause } from '@/shared/causes/cause-type'
import type { CauseNodeData } from '@/shared/component-types'
import { orbs } from '@/shared/causes/cause-orb'
import { essences } from '@/shared/causes/cause-essence'
import { fossils } from '@/shared/causes/cause-fossil'
import { horticraftings } from '@/shared/causes/cause-horticrafting'
import { craftingBenches } from '@/shared/causes/cause-crafting-bench'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'
import TiptapPostViewer from '@/components/editor/TiptapPostViewer.vue'
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const postId = route.params.postId as string

// 그래프 복사 버튼 핸들러
const handleCopyGraph = () => {
  router.push(`/posts/new?copyFrom=${postId}`)
}

const nodeTypes = {
  itemState: markRaw(VisualItemNode),
  causeNode: markRaw(VisualCauseNode),
}

const edgeTypes = {
  causeEdge: markRaw(VisualCauseEdge),
}

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

// API 요청
const api = pathOfRecipesApi()
const reactiveAxios = api.get(`/posts/${postId}`, {}, { immediate: true })

const { isLoading, responseData, error } = reactiveAxios

const postData = computed<PostResponse | null>(() => {
  return (responseData.value as PostResponse) || null
})

const hasPostContent = computed(() => {
  const content = postData.value?.content
  if (!content) return false
  try {
    JSON.parse(content)
    return true
  } catch {
    return false
  }
})

// VueFlow nodes와 edges
const nodes = ref<Node<ItemState | CauseNodeData>[]>([])
const edges = ref<
  Array<{
    id: string
    source: string
    target: string
    type?: string
    data?: { causes?: Cause[] }
  }>
>([])

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
        data: itemState,
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
    data?: { causes?: Cause[] }
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

// postData가 변경되면 VueFlow 데이터로 변환
watch(
  () => postData.value,
  (newPost) => {
    if (newPost) {
      convertPostResponseToVueFlow(newPost)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    style="
      width: 100%;
      height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      position: relative;
    "
  >
    <LoadingPanel v-if="isLoading" />
    <ErrorPanel
      v-else-if="error"
      :message="
        error?.message ??
        (typeof error === 'string' ? error : '게시글을 불러오는 중 오류가 발생했습니다')
      "
    />
    <div v-else-if="postData" style="flex: 1; min-height: 0; display: flex; flex-direction: column">
      <div
        style="
          padding: 16px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 600">{{ postData.title }}</h1>
          <div style="margin-top: 8px; font-size: 12px; color: #9ca3af">
            조회수 {{ postData.viewCount ?? 0 }} · 좋아요 {{ postData.likeCount ?? 0 }} · 싫어요 {{ postData.dislikeCount ?? 0 }}
          </div>
        </div>
        <NButton size="small" type="primary" @click="handleCopyGraph">그래프 복사</NButton>
      </div>
      <div style="flex: 1; min-height: 0">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :nodeTypes="nodeTypes"
          :edgeTypes="edgeTypes"
          :nodesConnectable="false"
          :elementsSelectable="false"
        >
          <MiniMap pannable zoomable />
        </VueFlow>
      </div>

      <div v-if="hasPostContent" style="padding: 16px; border-top: 1px solid rgba(148, 163, 184, 0.15)">
        <TiptapPostViewer :content="postData.content" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
