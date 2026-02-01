import type { Cause } from './causes/cause-type'

export interface CauseNodeData {
  causes: Cause[]
  sourceId: string
  targetId: string
  edgeId: string
  onRemoveEdge?: (nodeId: string) => void
  //todo 나중에 컬러 속성 넣기
}
