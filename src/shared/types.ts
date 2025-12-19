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
