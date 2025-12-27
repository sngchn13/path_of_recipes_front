import type { Placement } from '@/shared/types'

/**
 * 모드 생성 타입 ID와 라벨 매핑
 * CSV: mod_generation_types.csv
 */
const MOD_GENERATION_TYPE_LABELS: Record<number, { en: string; kor: string }> = {
  1: { en: 'Prefix', kor: '접두사' },
  2: { en: 'Suffix', kor: '접미사' },
  3: { en: 'Unique', kor: '고유' },
  4: { en: 'Nemesis', kor: '네메시스' },
  5: { en: 'Corrupted', kor: '타락' },
  6: { en: 'Bloodlines', kor: '혈통' },
  7: { en: 'Torment', kor: '고문' },
  8: { en: 'Tempest', kor: '폭풍' },
  9: { en: 'Talisman', kor: '탈리스만' },
  10: { en: 'Enchantment', kor: '인챈트' },
  11: { en: 'Essence', kor: '정수' },
  13: { en: 'Bestiary', kor: '야수' },
  14: { en: 'Delve', kor: '탐광' },
  15: { en: 'Synthesis', kor: '합성' },
  16: { en: 'Synthesis', kor: '합성' },
  17: { en: 'Synthesis', kor: '합성' },
  24: { en: '', kor: '' },
  25: { en: '', kor: '' },
  28: { en: 'RedImplicit', kor: '총주교' },
  29: { en: 'BlueImplicit', kor: '포식자' },
}

/**
 * 모드 생성 타입 ID를 영어 라벨로 변환
 */
export function getModGenerationTypeLabelEn(modGenerationTypeId: number): string {
  return MOD_GENERATION_TYPE_LABELS[modGenerationTypeId]?.en ?? ''
}

/**
 * 모드 생성 타입 ID를 한글 라벨로 변환
 */
export function getModGenerationTypeLabelKor(modGenerationTypeId: number): string {
  return MOD_GENERATION_TYPE_LABELS[modGenerationTypeId]?.kor ?? ''
}

/**
 * 모드 생성 타입 ID를 라벨 객체로 변환
 */
export function getModGenerationTypeLabel(modGenerationTypeId: number): {
  en: string
  kor: string
} {
  return MOD_GENERATION_TYPE_LABELS[modGenerationTypeId] ?? { en: '', kor: '' }
}

/**
 * 모드 생성 타입 ID를 Placement로 변환
 * - 1, 2: explicit
 * - 3, 5, 28, 29: implicit
 * - 10: enchantment
 * - 나머지: others
 */
export function getPlacementFromModGenerationTypeId(modGenerationTypeId: number): Placement {
  if (modGenerationTypeId === 1 || modGenerationTypeId === 2) {
    return 'explicit'
  }
  if (
    modGenerationTypeId === 3 ||
    modGenerationTypeId === 5 ||
    modGenerationTypeId === 28 ||
    modGenerationTypeId === 29
  ) {
    return 'implicit'
  }
  if (modGenerationTypeId === 10) {
    return 'enchantment'
  }
  return 'others'
}

/**
 * 모든 섹션 목록
 */
export const SECTIONS = [
  'normal',
  'master',
  'shaper',
  'elder',
  'crusader',
  'redeemer',
  'hunter',
  'warlord',
  'delve',
  'incursion',
  'veiled',
  'desecrated',
  'haunted',
  'infamous',
  'scourgeup',
  'scourgedown',
  'sentinel',
  'synthesis_corrupted',
  'warbands',
  'enchant',
  'essence',
  'bestiary',
  'corrupted',
  'searing',
  'eater',
  'synthesis',
] as const

export type Section = (typeof SECTIONS)[number]
