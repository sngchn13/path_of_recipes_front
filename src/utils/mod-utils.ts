import type { Placement } from '@/shared/types'

/**
 * 모드 생성 타입 ID와 라벨 매핑
 * CSV: mod_generation_types.csv
 */
const MOD_GENERATION_TYPE_LABELS: Record<
  number,
  { en: string; kor: string; simple: string; color: string }
> = {
  1: { en: 'Prefix', kor: '접두어', simple: 'P', color: '#DC2626' },
  2: { en: 'Suffix', kor: '접미어', simple: 'S', color: '#2563EB' },
  3: { en: 'Unique', kor: '고유', simple: 'U', color: '#9333EA' },
  4: { en: 'Nemesis', kor: '네메시스', simple: 'N', color: '#F97316' },
  5: { en: 'Corrupted', kor: '타락', simple: 'C', color: '#1F2937' },
  6: { en: 'Bloodlines', kor: '혈통', simple: 'B', color: '#DC2626' },
  7: { en: 'Torment', kor: '고문', simple: 'T', color: '#7C3AED' },
  8: { en: 'Tempest', kor: '폭풍', simple: 'T', color: '#FBBF24' },
  9: { en: 'Talisman', kor: '탈리스만', simple: 'T', color: '#F59E0B' },
  10: { en: 'Enchantment', kor: '인챈트', simple: 'E', color: '#14B8A6' },
  11: { en: 'Essence', kor: '정수', simple: 'E', color: '#0EA5E9' },
  13: { en: 'Bestiary', kor: '야수', simple: 'B', color: '#10B981' },
  14: { en: 'Delve', kor: '탐광', simple: 'D', color: '#92400E' },
  15: { en: 'Synthesis', kor: '합성', simple: 'S', color: '#EC4899' },
  16: { en: 'Synthesis', kor: '합성', simple: 'S', color: '#EC4899' },
  17: { en: 'Synthesis', kor: '합성', simple: 'S', color: '#EC4899' },
  24: { en: '', kor: '', simple: '24', color: '#6B7280' },
  25: { en: '', kor: '', simple: '25', color: '#6B7280' },
  28: { en: 'RedImplicit', kor: '총주교', simple: 'R', color: '#DC2626' },
  29: { en: 'BlueImplicit', kor: '포식자', simple: 'B', color: '#2563EB' },
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
  simple: string
  color: string
} {
  return (
    MOD_GENERATION_TYPE_LABELS[modGenerationTypeId] ?? {
      en: '',
      kor: '',
      simple: String(modGenerationTypeId),
      color: '#6B7280',
    }
  )
}

/**
 * 모드 생성 타입 ID를 simple과 color로 변환
 */
export function useSimpleLabel(modGenerationTypeId: number): {
  simple: string
  color: string
} {
  const label = MOD_GENERATION_TYPE_LABELS[modGenerationTypeId]
  if (label) {
    return {
      simple: label.simple,
      color: label.color,
    }
  }
  return {
    simple: String(modGenerationTypeId),
    color: '#6B7280',
  }
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
