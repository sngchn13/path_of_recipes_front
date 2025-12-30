import type { ItemState, ItemBase, AttachedMod, Placement, Rarity } from './types'

// API 응답 타입 정의
export interface PostResponse {
  id: string
  title: string
  content: string
  view: number
  like: number
  dislike: number
  graph: GraphResponse
  createdAt: string
  updatedAt: string | null
}

export interface GraphResponse {
  id: number
  description: string
  nodes: NodeResponse[]
  edges: EdgeResponse[]
}

export interface NodeResponse {
  id: string
  context: string
  rarity: string // "rare", "magic", "normal"
  itemLevel: number
  note: string
  positionX: number
  positionY: number
  itemBaseId: number
  itemBaseName: string
  itemBaseDisplayEn: string
  itemBaseDisplayKor: string
  itemTypeId: number
  itemTypeName: string
  mods: ModResponse[]
}

export interface EdgeResponse {
  id: string
  note: string
  sourceId: string
  targetId: string
  causes: string[]
}

export interface ModResponse {
  id: number
  nameEn: string | null
  nameKor: string | null
  displayEn: string
  displayKor: string
  reqItemLevel: number
  weight: number | null
  tier: number | null
  deprecatedVersion: string | null
  modGroupId: number
  modGroupValue: string
  modGenerationTypeId: number
  tags: string[]
  families: string[]
  section: string
  placement: string // "explicit", "implicit", "enchantment", "others"
}

/**
 * API 응답의 rarity 문자열을 Rarity 타입으로 변환
 */
function convertRarity(rarity: string): Rarity {
  const normalized = rarity.toLowerCase()
  if (normalized === 'rare' || normalized === 'magic' || normalized === 'normal') {
    return normalized as Rarity
  }
  return 'normal' // 기본값
}

/**
 * API 응답의 placement 문자열을 Placement 타입으로 변환
 */
function convertPlacement(placement: string): Placement {
  const normalized = placement.toLowerCase()
  if (
    normalized === 'explicit' ||
    normalized === 'implicit' ||
    normalized === 'enchantment' ||
    normalized === 'others'
  ) {
    return normalized as Placement
  }
  return 'others' // 기본값
}

/**
 * NodeResponse를 ItemState로 변환
 */
export function convertNodeResponseToItemState(node: NodeResponse): ItemState {
  const itemBase: ItemBase = {
    id: node.itemBaseId,
    name: node.itemBaseName,
    display_en: node.itemBaseDisplayEn,
    display_kor: node.itemBaseDisplayKor,
    item_type_name: node.itemTypeName,
  }

  const mods: AttachedMod[] = node.mods.map((mod) => ({
    id: mod.id,
    name_en: mod.nameEn || undefined,
    name_kor: mod.nameKor || undefined,
    display_en: mod.displayEn,
    display_kor: mod.displayKor,
    required_item_level: mod.reqItemLevel,
    weight: mod.weight || undefined,
    tier: mod.tier || undefined,
    mod_group: mod.modGroupValue,
    mod_generation_type_id: mod.modGenerationTypeId,
    tags: mod.tags,
    families: mod.families,
    section: mod.section,
    placement: convertPlacement(mod.placement),
  }))

  return {
    item_base: itemBase,
    context: node.context,
    rarity: convertRarity(node.rarity),
    item_level: node.itemLevel,
    note: node.note,
    mods,
  }
}
