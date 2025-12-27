import type { Placement, Rarity } from './types'

export interface NewNode {
  id: string
  context: string
  rarity: Rarity
  itemLevel: number
  note: string
  positionX: number
  positionY: number
  itemBaseId: number
  mods: ModWithPlacement[]
}

export interface NewEdge {
  id: string
  sourceId: string
  targetId: string
  causes: string[] //cause name속성
  note: string //일단 빈 문자열로 채우기
}

export interface NewGraph {
  nodes: NewNode[]
  edges: NewEdge[]
  description: string //일단 빈 문자열
}

export interface NewPost {
  title: string
  password: string
  graph: NewGraph
}

export interface ModWithPlacement {
  modId: number
  placement: Placement
}
