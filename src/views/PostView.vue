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
import type { NewReactionRequest } from '@/shared/request-types'
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
import CommentSection from '@/components/comment/CommentSection.vue'
import { NButton, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'

const route = useRoute()
const message = useMessage()
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

// 좋아요 / 싫어요
const reactionLoading = ref(false)

const sendReaction = async (reactionType: 'like' | 'dislike') => {
  reactionLoading.value = true
  const body: NewReactionRequest = { reactionType }
  try {
    const result = api.post(
      '/posts/{postId}/reactions',
      { pathVariables: { postId } },
      {
        immediate: false,
        callbacks: new Map([
          [201, () => void reactiveAxios.execute(null)],
          [409, () => { message.warning('이미 반응한 글입니다.') }],
          [500, () => { message.error('반응 등록에 실패했습니다.') }],
        ]),
      },
    )
    await result.execute(body)
  } finally {
    reactionLoading.value = false
  }
}
</script>

<template>
  <div class="post-view">
    <LoadingPanel v-if="isLoading" />
    <ErrorPanel
      v-else-if="error"
      :message="
        error?.message ??
        (typeof error === 'string' ? error : '게시글을 불러오는 중 오류가 발생했습니다')
      "
    />
    <template v-else-if="postData">
      <header class="post-view__header">
        <div>
          <h1 class="post-view__title">{{ postData.title }}</h1>
          <div class="post-view__meta">
            <span>조회수 {{ postData.viewCount ?? 0 }}</span>
            <NButton
              quaternary
              size="tiny"
              :disabled="reactionLoading"
              @click="sendReaction('like')"
            >
              좋아요 {{ postData.likeCount ?? 0 }}
            </NButton>
            <NButton
              quaternary
              size="tiny"
              :disabled="reactionLoading"
              @click="sendReaction('dislike')"
            >
              싫어요 {{ postData.dislikeCount ?? 0 }}
            </NButton>
          </div>
        </div>
        <NButton size="small" type="primary" @click="handleCopyGraph">그래프 복사</NButton>
      </header>

      <section class="post-view__graph-section">
        <h2 class="post-view__section-title">그래프</h2>
        <div class="post-view__graph-wrap">
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
      </section>

      <section v-if="hasPostContent" class="post-view__body-section">
        <h2 class="post-view__section-title">본문</h2>
        <div class="post-view__card">
          <TiptapPostViewer :content="postData.content" />
        </div>
      </section>

      <section class="post-view__comments-section">
        <h2 class="post-view__section-title">댓글</h2>
        <div class="post-view__card">
          <CommentSection :post-id="postId" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.post-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.post-view__header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--n-color, #fff);
}

.post-view__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.post-view__meta {
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-view__section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-color, #333);
}

.post-view__graph-section {
  padding: 16px;
}

.post-view__graph-wrap {
  height: 60vh;
  min-height: 360px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: var(--n-color-modal, #fafafa);
}

.post-view__graph-wrap :deep(.vue-flow) {
  height: 100%;
}

.post-view__body-section,
.post-view__comments-section {
  padding: 16px;
}

.post-view__card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: var(--n-color-modal, #fafafa);
}
</style>
