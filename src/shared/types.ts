export interface ItemType {
  name: string
  displayEn: string
  displayKor: string
}

export interface ItemBase {
  id: number
  name: string
  displayEn?: string
  displayKor?: string
  itemTypeName: string
}

export type Placement = 'IMPLICIT' | 'EXPLICIT' | 'ENCHANTMENT'

export interface AttachedMod {
  id: number
  nameEn?: string
  nameKor?: string
  displayEn: string
  displayKor: string
  requiredItemLevel: number
  weight?: number
  tier?: number
  modGroup: string
  modGenerationTypeId: number
  tags: string[]
  families: string[]
  section: string
  placement: Placement
}

export type Rarity = 'normal' | 'magic' | 'rare'

export interface ItemState {
  itemBase: ItemBase
  context: string
  rarity: Rarity
  itemLevel: number
  note: string
  mods: AttachedMod[]
}
