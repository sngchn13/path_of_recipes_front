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

export type Placement = 'IMPLICIT' | 'EXPLICIT' | 'ENCHANTMENT'

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
}

export type Rarity = 'normal' | 'magic' | 'rare'

export interface ItemState {
  item_base: ItemBase
  context: string
  rarity: Rarity
  item_level: number
  note: string
  mods: AttachedMod[]
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
