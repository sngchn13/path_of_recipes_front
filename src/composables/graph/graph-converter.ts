import type { Node } from '@vue-flow/core'
import type { ItemState } from '@/shared/types'
import type { NewNode, NewEdge, NewGraph } from '@/shared/request-types'
import type { Cause } from '@/shared/causes/cause-type'

type CauseEdgeData = { causes?: Cause[] }

type GraphEdge = {
  id: string
  source: string
  target: string
  type?: string
  data?: CauseEdgeData
}

/**
 * VueFlow Node를 NewNode로 변환
 */
export function convertNodeToNewNode(node: Node<ItemState>): NewNode {
  const itemState = node.data as ItemState

  return {
    id: node.id,
    context: itemState.context,
    rarity: itemState.rarity,
    itemLevel: itemState.item_level,
    note: itemState.note,
    positionX: node.position.x,
    positionY: node.position.y,
    itemBaseId: itemState.item_base.id,
    mods: itemState.mods.map((mod) => ({
      modId: mod.id,
      placement: mod.placement,
    })),
  }
}

/**
 * VueFlow Edge를 NewEdge로 변환
 */
export function convertEdgeToNewEdge(edge: GraphEdge): NewEdge {
  const causes = edge.data?.causes ?? []

  return {
    id: edge.id,
    sourceId: edge.source,
    targetId: edge.target,
    causes: causes.map((cause) => cause.name),
    note: '',
  }
}

/**
 * VueFlow의 nodes와 edges를 NewGraph로 변환
 */
export function convertToNewGraph(
  nodes: Node<ItemState>[],
  edges: GraphEdge[],
  description: string = '',
): NewGraph {
  return {
    nodes: nodes.map(convertNodeToNewNode),
    edges: edges.map(convertEdgeToNewEdge),
    description,
  }
}
