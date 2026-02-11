import type { Placement, Rarity } from './types'

/** 아직 필드 없음. 추후 기능 추가용 */
export type Context = Record<string, never>

/** API 직렬화 시 lowercase (elder, shaper, ...) */
export type Influence = 'elder' | 'shaper' | 'warlord' | 'crusader' | 'redeemer' | 'hunter'

export interface Flags {
  corrupted: boolean
  mirrored: boolean
  split: boolean
}

export interface NewNode {
  id: string
  context: Context
  rarity: Rarity
  itemLevel: number
  quality: number
  flags: Flags
  influences: Influence[]
  note?: string | null
  positionX: number
  positionY: number
  itemBaseId: number
  mods: ModWithPlacement[]
}

export interface NewEdge {
  id: string
  sourceId?: string | null
  targetId?: string | null
  causes: string[]
  note?: string | null
}

export interface NewGraph {
  nodes: NewNode[]
  edges: NewEdge[]
  description?: string | null
}

export interface NewPost {
  title: string
  password: string
  content: string
  graph: NewGraph
}

export interface ModWithPlacement {
  modId: number
  placement: Placement
  fractured: boolean
}
