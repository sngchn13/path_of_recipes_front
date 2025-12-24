import abberantFossilImage from '@/assets/images/causes/fossil/abberant_fossil.webp'
import aethericFossilImage from '@/assets/images/causes/fossil/aetheric_fossil.webp'
import bloodstainedFossilImage from '@/assets/images/causes/fossil/bloodstained_fossil.webp'
import corrodedFossilImage from '@/assets/images/causes/fossil/corroded_fossil.webp'
import deftFossilImage from '@/assets/images/causes/fossil/deft_fossil.webp'
import denseFossilImage from '@/assets/images/causes/fossil/dense_fossil.webp'
import facetedFossilImage from '@/assets/images/causes/fossil/faceted_fossil.webp'
import fracturedFossilImage from '@/assets/images/causes/fossil/fractured_fossil.webp'
import frigidFossilImage from '@/assets/images/causes/fossil/frigid_fossil.webp'
import fundamentalFossilImage from '@/assets/images/causes/fossil/fundamental_fossil.webp'
import glidedFossilImage from '@/assets/images/causes/fossil/glided_fossil.webp'
import glyphicFossilImage from '@/assets/images/causes/fossil/glyphic_fossil.webp'
import hollowFossilImage from '@/assets/images/causes/fossil/hollow_fossil.webp'
import jaggedFossilImage from '@/assets/images/causes/fossil/jagged_fossil.webp'
import lucentFossilImage from '@/assets/images/causes/fossil/lucent_fossil.webp'
import metallicFossilImage from '@/assets/images/causes/fossil/metallic_fossil.webp'
import opulentFossilImage from '@/assets/images/causes/fossil/opulent_fossil.webp'
import prismaticFossilImage from '@/assets/images/causes/fossil/prismatic_fossil.webp'
import pristineFossilImage from '@/assets/images/causes/fossil/pristine_fossil.webp'
import sanctifiedFossilImage from '@/assets/images/causes/fossil/sanctified_fossil.webp'
import scorchedFossilImage from '@/assets/images/causes/fossil/scorched_fossil.webp'
import serratedFossilImage from '@/assets/images/causes/fossil/serrated_fossil.webp'
import shudderingFossilImage from '@/assets/images/causes/fossil/shuddering_fossil.webp'
import tangledFossilImage from '@/assets/images/causes/fossil/tangled_fossil.webp'
import boundFossilImage from '@/assets/images/causes/fossil/bound_fossil.webp'

import type { Cause } from './cause-type'

export const fossils: Cause[] = [
  {
    name: 'scorched_fossil',
    image: scorchedFossilImage,
    display_name_en: 'Scorched Fossil',
    display_name_kor: '그을린 화석',
    description_en: 'More Fire modifiers\nNo Cold modifiers',
    description_kor: '화염 속성 부여 증가\n냉기 속성 부여 없음',
  },
  {
    name: 'frigid_fossil',
    image: frigidFossilImage,
    display_name_en: 'Frigid Fossil',
    display_name_kor: '차디찬 화석',
    description_en: 'More Cold modifiers\nNo Fire modifiers',
    description_kor: '냉기 속성 부여 증가\n화염 속성 부여 없음',
  },
  {
    name: 'metallic_fossil',
    image: metallicFossilImage,
    display_name_en: 'Metallic Fossil',
    display_name_kor: '금속성 화석',
    description_en: 'More Lightning modifiers\nNo Physical modifiers',
    description_kor: '번개 속성 부여 증가\n물리 속성 부여 없음',
  },
  {
    name: 'jagged_fossil',
    image: jaggedFossilImage,
    display_name_en: 'Jagged Fossil',
    display_name_kor: '뾰족한 화석',
    description_en: 'More Physical modifiers\nNo Chaos modifiers',
    description_kor: '물리 속성 부여 증가\n카오스 속성 부여 없음',
  },
  {
    name: 'abberrant_fossil',
    image: abberantFossilImage,
    display_name_en: 'Aberrant Fossil',
    display_name_kor: '특이한 화석',
    description_en: 'More Chaos modifiers\nNo Lightning modifiers',
    description_kor: '카오스 속성 부여 증가\n번개 속성 부여 없음',
  },

  {
    name: 'pristine_fossil',
    image: pristineFossilImage,
    display_name_en: 'Pristine Fossil',
    display_name_kor: '온전한 화석',
    description_en: 'More Life modifiers\nNo Defence modifiers',
    description_kor: '생명력 속성 부여 증가\n방어 속성 부여 없음',
  },
  {
    name: 'dense_fossil',
    image: denseFossilImage,
    display_name_en: 'Dense Fossil',
    display_name_kor: '조밀한 화석',
    description_en: 'More Defence modifiers\nNo Life Modifiers',
    description_kor: '방어 속성 부여 증가\n생명력 속성 부여 없음',
  },
  {
    name: 'corroded_fossil',
    image: corrodedFossilImage,
    display_name_en: 'Corroded Fossil',
    display_name_kor: '부식된 화석',
    description_en: 'More Physical Ailment or Chaos Ailment modifiers\nNo Elemental modifiers',
    description_kor: '물리 상태 이상 혹은 카오스 상태 이상 속성 부여 증가\n원소 속성 부여 없음',
  },
  {
    name: 'prismatic_fossil',
    image: prismaticFossilImage,
    display_name_en: 'Prismatic Fossil',
    display_name_kor: '분광 화석',
    description_en: 'More Elemental modifiers\nNo Physical Ailment or Chaos Ailment modifiers',
    description_kor: '원소 속성 부여 증가\n물리 상태 이상 혹은 카오스 상태 이상 속성 부여 없음',
  },
  {
    name: 'aetheric_fossil',
    image: aethericFossilImage,
    display_name_en: 'Aetheric Fossil',
    display_name_kor: '에테르 화석',
    description_en: 'More Caster modifiers\nFewer Attack modifiers',
    description_kor: '시전 속성 부여 증가\n공격 속성 부여 감소',
  },
  {
    name: 'serrated_fossil',
    image: serratedFossilImage,
    display_name_en: 'Serrated Fossil',
    display_name_kor: '톱니 화석',
    description_en: 'More Attack modifiers\nFewer Caster modifiers',
    description_kor: '공격 속성 부여 증가\n시전 속성 부여 감소',
  },
  {
    name: 'lucent_fossil',
    image: lucentFossilImage,
    display_name_en: 'Lucent Fossil',
    display_name_kor: '빛나는 화석',
    description_en: 'More Mana modifiers\nNo Speed modifiers',
    description_kor: '마나 속성 부여 증가\n속도 속성 부여 없음',
  },
  {
    name: 'shuddering_fossil',
    image: shudderingFossilImage,
    display_name_en: 'Shuddering Fossil',
    display_name_kor: '전율의 화석',
    description_en: 'More Speed modifiers\nNo Mana modifiers',
    description_kor: '속도 속성 부여 증가\n마나 속성 부여 없음',
  },
  {
    name: 'bound_fossil',
    image: boundFossilImage,
    display_name_en: 'Bound Fossil',
    display_name_kor: '속박의 화석',
    description_en: 'More Minion, Aura or Curse modifiers',
    description_kor: '소환수 혹은 오라 혹은 저주 속성 부여 증가',
  },

  {
    name: 'opulent_fossil',
    image: opulentFossilImage,
    display_name_en: 'Opulent Fossil',
    display_name_kor: '호화로운 화석',
    description_en: 'More Drop modifiers\nNo Tagless modifiers',
    description_kor: '출현 확률 속성 개수 증가\n태그 없는 속성 없음',
  },
  {
    name: 'deft_fossil',
    image: deftFossilImage,
    display_name_en: 'Deft Fossil',
    display_name_kor: '날렵한 화석',
    description_en: 'More Critical modifiers\nNo Attribute modifiers',
    description_kor: '치명타 속성 부여 증가\n능력치 속성 부여 없음',
  },
  {
    name: 'fundamental_fossil',
    image: fundamentalFossilImage,
    display_name_en: 'Fundamental Fossil',
    display_name_kor: '근본적인 화석',
    description_en: 'More Attribute modifiers\nNo Critical modifiers',
    description_kor: '능력치 속성 부여 증가\n치명타 속성 부여 없음',
  },
  {
    name: 'faceted_fossil',
    image: facetedFossilImage,
    display_name_en: 'Faceted Fossil',
    display_name_kor: '연마한 화석',
    description_en: 'More Gem modifiers',
    description_kor: '젬 속성 부여 증가',
  },
  {
    name: 'bloodstained_fossil',
    image: bloodstainedFossilImage,
    display_name_en: 'Bloodstained Fossil',
    display_name_kor: '피얼룩 화석',
    description_en:
      'Does not apply to: Contracts, Blueprints, Heist Equipment\nCorrupted\nHas a Corrupted implicit modifier',
    description_kor: '미적용: 계약, 도면, 강탈 장비\n타락\n타락한 고정 속성 부여 보유',
  },
  {
    name: 'hollow_fossil',
    image: hollowFossilImage,
    display_name_en: 'Hollow Fossil',
    display_name_kor: '공허의 화석',
    description_en:
      'Applies to: Weapons, Body Armour, Helmets, Gloves, Boots\nHas an Abyssal socket',
    description_kor: '적용: 무기, 갑옷, 투구, 장갑, 장화\n심연 홈 보유',
  },
  {
    name: 'fractured_fossil',
    image: fracturedFossilImage,
    display_name_en: 'Fractured Fossil',
    display_name_kor: '분열된 화석',
    description_en:
      'Creates a split copy\nCannot be used to split Influenced,\nEnchanted, Fractured, or Synthesised items',
    description_kor:
      '분할된 복제본을 만듭니다.\n영향을 받은 아이템,\n인챈트된 아이템, 결합된 아이템, 분열된 아이템은 분할할 수 없습니다.',
  },
  {
    name: 'glyphic_fossil',
    image: glyphicFossilImage,
    display_name_en: 'Glyphic Fossil',
    display_name_kor: '상형 문자 화석',
    description_en:
      'Applies to: Weapons, Body Armour, Shields, Helmets, Gloves, Boots, Amulets, Belts, Rings, Quivers\nHas a Corrupt Essence modifier',
    description_kor:
      '적용: 무기, 갑옷, 방패, 투구, 장갑, 장화, 목걸이, 허리띠, 반지, 화살통\n타락 에센스 속성 부여 보유',
  },
  {
    name: 'tangled_fossil',
    image: tangledFossilImage,
    display_name_en: 'Tangled Fossil',
    display_name_kor: '얽혀든 화석',
    description_en:
      'Makes a random modifier type much more likely and prevents\nanother random modifier type\nEffects revealed once resonator is fully socketed',
    description_kor:
      '무작위 속성 유형 1개의 등장 확률을 크게 높이고\n다른 무작위 속성 유형 1개를 등장하지 않게 합니다.\n효과는 공명기의 모든 홈에 화석을 장착한 후 드러납니다.',
  },
  {
    name: 'sanctified_fossil',
    image: sanctifiedFossilImage,
    display_name_en: 'Sanctified Fossil',
    display_name_kor: '축성된 화석',
    description_en: 'Numeric modifier values are lucky\nHigh Level modifiers are more common',
    description_kor: '속성 부여 결정 시 관련 수치 개선\n고레벨 속성 부여 등장 빈도 증가',
  },
  {
    name: 'gilded_fossil',
    image: glidedFossilImage,
    display_name_en: 'Gilded Fossil',
    display_name_kor: '도금된 화석',
    description_en: 'Item is overvalued by vendors',
    description_kor: '상인에게 판매할 때 얻는 화폐 증가',
  },
]
