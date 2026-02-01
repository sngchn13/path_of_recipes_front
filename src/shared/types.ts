export interface ItemType {
  name: string
  display_en: string
  display_kor: string
}

export interface ItemBase {
  id: number
  name: string
  display_en?: string
  display_kor?: string
  item_type_name: string
}

export type Placement = 'implicit' | 'explicit' | 'enchantment' | 'others'

export interface AttachedMod {
  id: number
  name_en?: string
  name_kor?: string
  display_en: string
  display_kor: string
  required_item_level: number
  weight?: number
  tier?: number
  mod_group: string
  mod_generation_type_id: number
  tags: string[]
  families: string[]
  section: string
  placement: Placement
  /** 분열 여부 (ModWithPlacement.fractured와 동일) */
  fractured?: boolean
}

export type Rarity = 'normal' | 'magic' | 'rare'

/** Influence 타입 (request-types와 동기화) */
export type Influence =
  | 'elder'
  | 'shaper'
  | 'warlord'
  | 'crusader'
  | 'redeemer'
  | 'hunter'

export interface Flags {
  corrupted: boolean
  mirrored: boolean
  split: boolean
}

export interface ItemState {
  item_base: ItemBase
  context: string
  rarity: Rarity
  item_level: number
  note: string
  mods: AttachedMod[]
  /** 인플루언스 목록 (편집 시 사용, 없으면 []) */
  influences?: Influence[]
  /** 플래그 (편집 시 사용, 없으면 모두 false) */
  flags?: Flags
}

export interface ModGroup {
  id: number
  value: string
  mod_generation_type_id: number
  item_type: string
  tags: string[]
  families: string[]
  section: string
  mods: Mod[]
}

export interface Mod {
  id: number
  name_en: string | null
  name_kor: string | null
  display_en: string
  display_kor: string
  req_item_level: number
  weight: number | null
  tier: number | null
  deprecated_version: string | null
  created_at: string
  updated_at: string | null
}

export interface Pageable {
  page: number // 1부터 시작
  size: number
  totalItems: number
  totalPages: number
}

export interface Page<T> {
  content: T[]
  pageable: Pageable
}
