/**
 * 아이템 노드 두 개 사이에 놓일 엣지(캐시) 노드의 위치를 계산합니다.
 * VueFlow 노드 position은 좌상단 기준이므로, 두 노드의 시각적 중심(정중앙) 사이의 중점을 사용합니다.
 */
const ITEM_NODE_APPROX_WIDTH = 250
const ITEM_NODE_APPROX_HEIGHT = 80

export function getCauseNodePosition(
  sourcePosition: { x: number; y: number },
  targetPosition: { x: number; y: number },
): { x: number; y: number } {
  const halfW = ITEM_NODE_APPROX_WIDTH / 2
  const halfH = ITEM_NODE_APPROX_HEIGHT / 2
  return {
    x: (sourcePosition.x + targetPosition.x) / 2 + halfW,
    y: (sourcePosition.y + targetPosition.y) / 2 + halfH,
  }
}
