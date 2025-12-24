import awakenersOrbImage from '@/assets/images/causes/orb/awakeners_orb.webp'
import chaosOrbImage from '@/assets/images/causes/orb/chaos_orb.webp'
import crusadersExaltedOrbImage from '@/assets/images/causes/orb/crusaders_exalted_orb.webp'
import eldersExaltedOrbImage from '@/assets/images/causes/orb/elders_exalted_orb.webp'
import eldritchChaosOrbImage from '@/assets/images/causes/orb/eldritch_chaos_orb.webp'
import eldritchExaltedOrbImage from '@/assets/images/causes/orb/eldritch_exalted_orb.webp'
import eldritchOrbOfAnnulmentImage from '@/assets/images/causes/orb/eldritch_orb_of_annulment.webp'
import exaltedOrbImage from '@/assets/images/causes/orb/exalted_orb.webp'
import exceptionalEldritchEmberImage from '@/assets/images/causes/orb/exceptional_eldritch_ember.webp'
import exceptionalEldritchIchorImage from '@/assets/images/causes/orb/exceptional_eldritch_ichor.webp'
import grandEldritchEmberImage from '@/assets/images/causes/orb/grand_eldritch_ember.webp'
import grandEldritchIchorImage from '@/assets/images/causes/orb/grand_eldritch_ichor.webp'
import greaterEldritchEmberImage from '@/assets/images/causes/orb/greater_eldritch_ember.webp'
import greaterEldritchIchorImage from '@/assets/images/causes/orb/greater_eldritch_ichor.webp'
import huntersExaltedOrbImage from '@/assets/images/causes/orb/hunters_exalted_orb.webp'
import lesserEldritchEmberImage from '@/assets/images/causes/orb/lesser_eldritch_ember.webp'
import lesserEldritchIchorImage from '@/assets/images/causes/orb/lesser_eldritch_ichor.webp'
import orbOfAlchemyImage from '@/assets/images/causes/orb/orb_of_alchemy.webp'
import orbOfAlterationImage from '@/assets/images/causes/orb/orb_of_alteration.webp'
import orbOfAnnulmentImage from '@/assets/images/causes/orb/orb_of_annulment.webp'
import orbOfAugmentationImage from '@/assets/images/causes/orb/orb_of_augmentation.webp'
import orbOfConflictImage from '@/assets/images/causes/orb/orb_of_conflict.webp'
import orbOfDominanceImage from '@/assets/images/causes/orb/orb_of_dominance.webp'
import orbOfScouringImage from '@/assets/images/causes/orb/orb_of_scouring.webp'
import orbOfTransmutationImage from '@/assets/images/causes/orb/orb_of_transmutation.webp'
import redeemersExaltedOrbImage from '@/assets/images/causes/orb/redeemers_exalted_orb.webp'
import regalOrbImage from '@/assets/images/causes/orb/regal_orb.webp'
import shapersExaltedOrbImage from '@/assets/images/causes/orb/shapers_exalted_orb.webp'
import vaalOrbImage from '@/assets/images/causes/orb/vaal_orb.webp'
import veiledChaosOrbImage from '@/assets/images/causes/orb/veiled_chaos_orb.webp'
import veiledExaltedOrbImage from '@/assets/images/causes/orb/veiled_exalted_orb.webp'
import warloadsExaltedOrbImage from '@/assets/images/causes/orb/warloads_exalted_orb.webp'

import type { Cause } from './cause-type'

// src/assets/images/causes/orb 기준으로 모든 오브 이미지를 정의
export const orbs: Cause[] = [
  {
    name: 'awakeners_orb',
    image: awakenersOrbImage,
    display_name_en: 'Awakeners Orb',
    display_name_kor: '각성자의 오브',
    description_en:
      'Destroys an item, applying its influence to another of the same item class\nThe second item is reforged as a rare item with both influence types and new modifiers',
    description_kor:
      '아이템을 파괴하여 해당 아이템에 적용된 영향력을 아이템 종류가 동일한 다른 아이템에 적용하십시오.\n영향력을 적용받은 아이템은 두 종류의 영향력과 신규 속성 부여가 적용된 희귀 아이템으로 재련됩니다.',
  },
  {
    name: 'chaos_orb',
    image: chaosOrbImage,
    display_name_en: 'Chaos Orb',
    display_name_kor: '카오스 오브',
    description_en: 'Reforges a rare item with new random modifiers',
    description_kor: '희귀 아이템을 재련해 무작위 신규 속성 부여',
  },
  {
    name: 'crusaders_exalted_orb',
    image: crusadersExaltedOrbImage,
    display_name_en: 'Crusaders Exalted Orb',
    display_name_kor: '십자군의 엑잘티드 오브',
    description_en: 'Adds Crusader influence and a new Crusader modifier to a rare item',
    description_kor: '희귀 아이템에 십자군 영향력 및 신규 십자군 속성 부여 추가',
  },
  {
    name: 'elders_exalted_orb',
    image: eldersExaltedOrbImage,
    display_name_en: 'Elders Exalted Orb',
    display_name_kor: '엘더의 엑잘티드 오브',
    description_en: 'Adds Elder influence and a new Elder modifier to a rare item',
    description_kor: '희귀 아이템에 엘더 영향력 및 신규 엘더 속성 부여 추가',
  },
  {
    name: 'eldritch_chaos_orb',
    image: eldritchChaosOrbImage,
    display_name_en: 'Eldritch Chaos Orb',
    display_name_kor: '섬뜩한 카오스 오브',
    description_en:
      'If The Searing Exarch is dominant, reroll prefix modifiers\nIf The Eater of Worlds is dominant, reroll suffix modifiers',
    description_kor:
      '작열의 총주교가 지배적인 경우 접두어 속성을 무작위 변경합니다.\n세계 포식자가 지배적인 경우 접미어 속성을 무작위 변경합니다.',
  },
  {
    name: 'eldritch_exalted_orb',
    image: eldritchExaltedOrbImage,
    display_name_en: 'Eldritch Exalted Orb',
    display_name_kor: '섬뜩한 엑잘티드 오브',
    description_en:
      'If The Searing Exarch is dominant, add a prefix modifier\nIf The Eater of Worlds is dominant, add a suffix modifier',
    description_kor:
      '작열의 총주교가 지배적인 경우 접두어 속성을 추가합니다.\n세계 포식자가 지배적인 경우 접미어 속성을 추가합니다.',
  },
  {
    name: 'eldritch_orb_of_annulment',
    image: eldritchOrbOfAnnulmentImage,
    display_name_en: 'Eldritch Orb of Annulment',
    display_name_kor: '섬뜩한 소멸의 오브',
    description_en:
      'If The Searing Exarch is dominant, remove a prefix modifier\nIf The Eater of Worlds is dominant, remove a suffix modifier',
    description_kor:
      '작열의 총주교가 지배적인 경우 접두어 속성을 제거합니다.\n세계 포식자가 지배적인 경우 접미어 속성을 제거합니다.',
  },
  {
    name: 'exalted_orb',
    image: exaltedOrbImage,
    display_name_en: 'Exalted Orb',
    display_name_kor: '엑잘티드 오브',
    description_en: 'Augments a rare item with a new random modifier',
    description_kor: '희귀 아이템에 신규 무작위 속성 부여',
  },
  {
    name: 'exceptional_eldritch_ember',
    image: exceptionalEldritchEmberImage,
    display_name_en: 'Exceptional Eldritch Ember',
    display_name_kor: '특출난 섬뜩한 불씨',
    description_en:
      'Adds an Exceptional Searing Exarch implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n특급 작열의 총주교 고정 속성을 추가합니다.\n아이템에 세계 포식자 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'exceptional_eldritch_ichor',
    image: exceptionalEldritchIchorImage,
    display_name_en: 'Exceptional Eldritch Ichor',
    display_name_kor: '특출난 섬뜩한 영액',
    description_en:
      'Adds an Exceptional Eater of Worlds implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Searing Exarch implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n특급 세계 포식자 고정 속성을 추가합니다.\n아이템에 작열의 총주교 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'grand_eldritch_ember',
    image: grandEldritchEmberImage,
    display_name_en: 'Grand Eldritch Ember',
    display_name_kor: '우수한 섬뜩한 불씨',
    description_en:
      'Adds a Grand Searing Exarch implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n최상급 작열의 총주교 고정 속성을 추가합니다.\n아이템에 세계 포식자 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'grand_eldritch_ichor',
    image: grandEldritchIchorImage,
    display_name_en: 'Grand Eldritch Ichor',
    display_name_kor: '우수한 섬뜩한 영액',
    description_en:
      'Adds a Grand Eater of Worlds implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Searing Exarch implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n최상급 세계 포식자 고정 속성을 추가합니다.\n아이템에 작열의 총주교 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'greater_eldritch_ember',
    image: greaterEldritchEmberImage,
    display_name_en: 'Greater Eldritch Ember',
    display_name_kor: '상급 섬뜩한 불씨',
    description_en:
      'Adds a Greater Searing Exarch implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n상급 작열의 총주교 고정 속성을 추가합니다.\n아이템에 세계 포식자 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'greater_eldritch_ichor',
    image: greaterEldritchIchorImage,
    display_name_en: 'Greater Eldritch Ichor',
    display_name_kor: '상급 섬뜩한 영액',
    description_en:
      'Adds a Greater Searing Exarch implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n상급 작열의 총주교 고정 속성을 추가합니다.\n아이템에 세계 포식자 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'hunters_exalted_orb',
    image: huntersExaltedOrbImage,
    display_name_en: 'Hunters Exalted Orb',
    display_name_kor: '사냥꾼의 엑잘티드 오브',
    description_en: 'Adds Hunter influence and a new Hunter modifier to a rare item',
    description_kor: '희귀 아이템에 사냥꾼 영향력 및 신규 사냥꾼 속성 부여 추가',
  },
  {
    name: 'lesser_eldritch_ember',
    image: lesserEldritchEmberImage,
    display_name_en: 'Lesser Eldritch Ember',
    display_name_kor: '하급 섬뜩한 불씨',
    description_en:
      'Adds a Lesser Searing Exarch implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n하급 작열의 총주교 고정 속성을 추가합니다.\n아이템에 세계 포식자 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'lesser_eldritch_ichor',
    image: lesserEldritchIchorImage,
    display_name_en: 'Lesser Eldritch Ichor',
    display_name_kor: '하급 섬뜩한 영액',
    description_en:
      'Adds a Lesser Searing Exarch implicit modifier to\na Body Armour, Boots, Gloves or Helmet\nThis replaces any existing implicit modifiers other than Eater of Worlds implicit modifiers',
    description_kor:
      '갑옷, 장화, 장갑 또는 투구에\n하급 작열의 총주교 고정 속성을 추가합니다.\n아이템에 세계 포식자 고정 속성 외, 다른 고정 속성이 있을 경우 그 속성을 대체합니다.',
  },
  {
    name: 'orb_of_alchemy',
    image: orbOfAlchemyImage,
    display_name_en: 'Orb of Alchemy',
    display_name_kor: '연금술의 오브',
    description_en: 'Upgrades a normal item to a rare item',
    description_kor: '일반 아이템을 희귀 아이템으로 업그레이드',
  },
  {
    name: 'orb_of_alteration',
    image: orbOfAlterationImage,
    display_name_en: 'Orb of Alteration',
    display_name_kor: '변화의 오브',
    description_en: 'Reforges a magic item with new random modifiers',
    description_kor: '마법 아이템을 재련하며 무작위 신규 속성 부여',
  },
  {
    name: 'orb_of_annulment',
    image: orbOfAnnulmentImage,
    display_name_en: 'Orb of Annulment',
    display_name_kor: '소멸의 오브',
    description_en: 'Removes a random modifier from an item',
    description_kor: '아이템에서 무작위 속성 제거',
  },
  {
    name: 'orb_of_augmentation',
    image: orbOfAugmentationImage,
    display_name_en: 'Orb of Augmentation',
    display_name_kor: '확장의 오브',
    description_en: 'Augments a magic item with a new random modifier',
    description_kor: '마법 아이템에 무작위로 새로운 속성 부여',
  },

  {
    name: 'orb_of_conflict',
    image: orbOfConflictImage,
    display_name_en: 'Orb of Conflict',
    display_name_kor: '갈등의 오브',
    description_en:
      'Unpredictably raise the strength of one Searing Exarch or Eater of Worlds modifier on an item and lower the strength of another\nLesser modifiers that have their strength lowered will be removed',
    description_kor:
      '아이템에 부여된 작열의 총주교 또는 세계 포식자 속성 하나의 강도를 예측 불가능하게 올리고, 나머지 하나의 강도는 낮춥니다.\n낮아지는 강도가 하급 속성일 경우 그 속성은 제거됩니다.',
  },
  {
    name: 'orb_of_dominance',
    image: orbOfDominanceImage,
    display_name_en: 'Orb of Dominance',
    display_name_kor: '지배의 오브',
    description_en:
      'Removes one Influenced Modifier from an item with at least two Influenced\nModifiers and upgrades another Influenced Modifier\nUpgrading a modifier of the highest tier transforms the\nmodifier into an Elevated Modifier\nAttempting to upgrade an Elevated Modifier rerolls its values\nCan be used on Body Armours, Boots, Gloves and Helmets',
    description_kor:
      '영향을 받은 속성이 2개 이상 부여된 아이템에서 영향을 받은 속성을 1개 제거합니다.\n다른 1개의 속성은 업그레이드합니다.\n업그레이드하는 속성의 등급이 가장 높은 상태라면,\n해당 속성은 고양된 속성으로 바뀝니다.\n고양된 속성을 업그레이드하는 경우 해당 수치는 무작위로 변경됩니다.\n갑옷, 장화, 장갑, 투구에 사용할 수 있습니다.',
  },
  {
    name: 'orb_of_scouring',
    image: orbOfScouringImage,
    display_name_en: 'Orb of Scouring',
    display_name_kor: '정제의 오브',
    description_en: 'Removes all modifiers from an item',
    description_kor: '아이템의 모든 속성 부여 제거',
  },
  {
    name: 'orb_of_transmutation',
    image: orbOfTransmutationImage,
    display_name_en: 'Orb of Transmutation',
    display_name_kor: '진화의 오브',
    description_en: 'Upgrades a normal item to a magic item',
    description_kor: '일반 아이템을 마법 아이템으로 업그레이드',
  },
  {
    name: 'redeemers_exalted_orb',
    image: redeemersExaltedOrbImage,
    display_name_en: "Redeemer's Exalted Orb",
    display_name_kor: '대속자의 엑잘티드 오브',
    description_en: 'Adds Redeemer influence and a new Redeemer modifier to a rare item',
    description_kor: '희귀 아이템에 대속자 영향력 및 신규 대속자 속성 부여 추가',
  },
  {
    name: 'regal_orb',
    image: regalOrbImage,
    display_name_en: 'Regal Orb',
    display_name_kor: '제왕의 오브',
    description_en: 'Upgrades a magic item to a rare item',
    description_kor: '마법 아이템을 희귀 아이템으로 업그레이드',
  },
  {
    name: 'shapers_exalted_orb',
    image: shapersExaltedOrbImage,
    display_name_en: "Shaper's Exalted Orb",
    display_name_kor: '쉐이퍼의 엑잘티드 오브',
    description_en: 'Adds Shaper influence and a new Shaper modifier to a rare item',
    description_kor: '희귀 아이템에 쉐이퍼 영향력 및 신규 쉐이퍼 속성 추가',
  },
  {
    name: 'vaal_orb',
    image: vaalOrbImage,
    display_name_en: 'Vaal Orb',
    display_name_kor: '바알 오브',
    description_en: 'Corrupts an item, modifying it unpredictably',
    description_kor: '아이템을 타락시키며 예측 불가능한 속성 부여',
  },
  {
    name: 'veiled_chaos_orb',
    image: veiledChaosOrbImage,
    display_name_en: 'Veiled Chaos Orb',
    display_name_kor: '장막의 카오스 오브',
    description_en:
      'Reforges a rare item with new random modifiers including a random Veiled modifier',
    description_kor:
      '희귀 아이템을 재련해 무작위 장막 속성을 1개 포함하여 무작위 신규 속성들을 부여합니다.',
  },
  {
    name: 'veiled_exalted_orb',
    image: veiledExaltedOrbImage,
    display_name_en: 'Veiled Exalted Orb',
    display_name_kor: '장막의 엑잘티드 오브',
    description_en: 'Removes a random modifier and adds a random Veiled modifier to a rare item',
    description_kor: '희귀 아이템의 무작위 속성을 1개 제거하고 무작위 장막 속성을 1개 추가합니다',
  },
  {
    name: 'warloads_exalted_orb',
    image: warloadsExaltedOrbImage,
    display_name_en: "Warlord's Exalted Orb",
    display_name_kor: '전쟁군주의 엑잘티드 오브',
    description_en: 'Adds Warlord influence and a new Warlord modifier to a rare item',
    description_kor: '희귀 아이템에 전쟁군주 영향력 및 신규 전쟁군주 속성 부여 추가',
  },
]
