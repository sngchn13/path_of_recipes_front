import { ref, type Ref } from 'vue'
import { createUniqueId } from '@/utils/unique-id'
import type { Cause } from '@/shared/causes/cause-type'
import type { Node } from '@vue-flow/core'
import type { CauseNodeData } from '@/shared/component-types'

// edges: VueFlow 의 edges 배열
// causes: 작업대에서 선택된 causes 배열
// clearCauses: 작업이 끝났을 때 causes 를 비우는 함수
export function useCauseEdges(
  nodes: Ref<Node<any>[]>,
  edges: Ref<
    Array<{
      id: string
      source: string
      target: string
      type?: string
      data?: { causes?: Cause[] } | undefined
    }>
  >,
  causes: Ref<Cause[]>,
  clearCauses: () => void,
  onRemoveEdge: (nodeId: string) => void,
) {
  // a -> b 엣지를 만들기 위해 첫 번째로 클릭한 노드 id 를 기억
  const pendingSourceNodeId = ref<string | null>(null)

  /**
   * cause 가 선택된 상태에서 노드를 클릭했을 때
   * - 첫 번째 노드: 출발 노드로만 기억
   * - 두 번째 노드: a -> b 엣지 생성 또는 기존 엣지의 causes 뒤에 append
   *
   * @param clickedNodeId 클릭된 노드의 id
   * @returns true 면 cause 엣지 처리용 클릭이었고, false 면 일반 노드 클릭으로 처리해야 함
   */
  const handleNodeClickForCauses = (clickedNodeId: string): boolean => {
    if (causes.value.length === 0) {
      // cause 가 없으면 이 로직은 관여하지 않음
      pendingSourceNodeId.value = null
      return false
    }

    const clickedNode = nodes.value.find((node) => node.id === clickedNodeId)
    if (clickedNode?.type === 'causeNode') {
      return true
    }

    // 첫 번째 클릭: 출발 노드만 기억
    if (!pendingSourceNodeId.value) {
      pendingSourceNodeId.value = clickedNodeId
      return true
    }

    const sourceId = pendingSourceNodeId.value
    const targetId = clickedNodeId

    // 같은 노드를 두 번 클릭한 경우는 무시하고 상태만 초기화
    if (sourceId === targetId) {
      pendingSourceNodeId.value = null
      return true
    }

    const existingCauseNode = nodes.value.find((node) => {
      if (node.type !== 'causeNode') return false
      const data = node.data as CauseNodeData | undefined
      return data?.sourceId === sourceId && data?.targetId === targetId
    })

    if (existingCauseNode) {
      const data = existingCauseNode.data as CauseNodeData
      existingCauseNode.data = {
        ...data,
        causes: [...data.causes, ...causes.value],
        onRemoveEdge,
      }
    } else {
      const sourceNode = nodes.value.find((node) => node.id === sourceId)
      const targetNode = nodes.value.find((node) => node.id === targetId)
      if (sourceNode && targetNode && sourceNode.position && targetNode.position) {
        const midPosition = {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        }
        const edgeId = createUniqueId('edge')
        const causeNodeId = createUniqueId('cause-node')
        nodes.value.push({
          id: causeNodeId,
          type: 'causeNode',
          position: midPosition,
          data: {
            causes: [...causes.value],
            sourceId,
            targetId,
            edgeId,
            onRemoveEdge,
          } as CauseNodeData,
        })

        edges.value.push({
          id: createUniqueId('edge-link'),
          source: sourceId,
          target: causeNodeId,
          type: 'causeEdge',
        })
        edges.value.push({
          id: createUniqueId('edge-link'),
          source: causeNodeId,
          target: targetId,
          type: 'causeEdge',
        })
      }
    }

    // 작업이 끝났으니 상태 초기화
    pendingSourceNodeId.value = null
    clearCauses()

    return true
  }

  return {
    pendingSourceNodeId,
    handleNodeClickForCauses,
  }
}
