import reforgePhysicalModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeLightningModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeColdModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeFireModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeChaosModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeDefenseModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeAttackModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeCasterModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeSpeedModImage from '@/assets/images/causes/horticrafting.webp'
import reforgeCriticalModImage from '@/assets/images/causes/horticrafting.webp'
import changeResFireToColdImage from '@/assets/images/causes/horticrafting.webp'
import changeResFireToLightningImage from '@/assets/images/causes/horticrafting.webp'
import changeResColdToFireImage from '@/assets/images/causes/horticrafting.webp'
import changeResColdToLightningImage from '@/assets/images/causes/horticrafting.webp'
import changeResLightningToFireImage from '@/assets/images/causes/horticrafting.webp'
import changeResLightningToColdImage from '@/assets/images/causes/horticrafting.webp'
import addPhysicalModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addLightningModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addColdModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addFireModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addChaosModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addLifeModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addDefenseModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addAttackModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addCasterModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addSpeedModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'
import addCriticalModAndRemoveRandomModImage from '@/assets/images/causes/horticrafting.webp'

import type { Cause } from './cause-type'

export const horticraftings: Cause[] = [
  // -----------------------------
  // Reforge (특정 태그 포함 리포지)
  // -----------------------------
  {
    name: 'reforge_physical_mod',
    image: reforgePhysicalModImage,
    display_name_en: 'Reforge Physical Mod',
    display_name_kor: '물리 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Physical modifier',
    description_kor: '희귀 아이템을 재련해 물리 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_fire_mod',
    image: reforgeFireModImage,
    display_name_en: 'Reforge Fire Mod',
    display_name_kor: '화염 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Fire modifier',
    description_kor: '희귀 아이템을 재련해 화염 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_cold_mod',
    image: reforgeColdModImage,
    display_name_en: 'Reforge Cold Mod',
    display_name_kor: '냉기 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Cold modifier',
    description_kor: '희귀 아이템을 재련해 냉기 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_lightning_mod',
    image: reforgeLightningModImage,
    display_name_en: 'Reforge Lightning Mod',
    display_name_kor: '번개 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Lightning modifier',
    description_kor: '희귀 아이템을 재련해 번개 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_life_mod',
    image: reforgePhysicalModImage, // 일단 horticrafting.webp 공통 사용
    display_name_en: 'Reforge Life Mod',
    display_name_kor: '생명력 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Life modifier',
    description_kor: '희귀 아이템을 재련해 생명력 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_defense_mod',
    image: reforgeDefenseModImage,
    display_name_en: 'Reforge Defence Mod',
    display_name_kor: '방어 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Defence modifier',
    description_kor: '희귀 아이템을 재련해 방어 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_chaos_mod',
    image: reforgeChaosModImage,
    display_name_en: 'Reforge Chaos Mod',
    display_name_kor: '카오스 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Chaos modifier',
    description_kor: '희귀 아이템을 재련해 카오스 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_attack_mod',
    image: reforgeAttackModImage,
    display_name_en: 'Reforge Attack Mod',
    display_name_kor: '공격 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including an Attack modifier',
    description_kor: '희귀 아이템을 재련해 공격 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_caster_mod',
    image: reforgeCasterModImage,
    display_name_en: 'Reforge Caster Mod',
    display_name_kor: '시전 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Caster modifier',
    description_kor: '희귀 아이템을 재련해 시전 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_speed_mod',
    image: reforgeSpeedModImage,
    display_name_en: 'Reforge Speed Mod',
    display_name_kor: '속도 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Speed modifier',
    description_kor: '희귀 아이템을 재련해 속도 속성을 포함하는 무작위 신규 속성 부여',
  },
  {
    name: 'reforge_critical_mod',
    image: reforgeCriticalModImage,
    display_name_en: 'Reforge Critical Mod',
    display_name_kor: '치명타 속성 재련',
    description_en: 'Reforge a Rare item with random modifiers, including a Critical modifier',
    description_kor: '희귀 아이템을 재련해 치명타 속성을 포함하는 무작위 신규 속성 부여',
  },

  // -----------------------------
  // Change resistance modifier type
  // -----------------------------
  {
    name: 'change_res_cold_to_fire',
    image: changeResColdToFireImage,
    display_name_en: 'Change Cold Resistance to Fire Resistance',
    display_name_kor: '냉기 저항 → 화염 저항 변경',
    description_en:
      'Change a modifier that grants Cold Resistance into a similar-tier modifier that grants Fire Resistance',
    description_kor:
      '냉기 저항을 부여하는 속성 1개를 화염 저항을 부여하는 비슷한 등급의 속성으로 변경',
  },
  {
    name: 'change_res_lightning_to_fire',
    image: changeResLightningToFireImage,
    display_name_en: 'Change Lightning Resistance to Fire Resistance',
    display_name_kor: '번개 저항 → 화염 저항 변경',
    description_en:
      'Change a modifier that grants Lightning Resistance into a similar-tier modifier that grants Fire Resistance',
    description_kor:
      '번개 저항을 부여하는 속성 1개를 화염 저항을 부여하는 비슷한 등급의 속성으로 변경',
  },
  {
    name: 'change_res_fire_to_cold',
    image: changeResFireToColdImage,
    display_name_en: 'Change Fire Resistance to Cold Resistance',
    display_name_kor: '화염 저항 → 냉기 저항 변경',
    description_en:
      'Change a modifier that grants Fire Resistance into a similar-tier modifier that grants Cold Resistance',
    description_kor:
      '화염 저항을 부여하는 속성 1개를 냉기 저항을 부여하는 비슷한 등급의 속성으로 변경',
  },
  {
    name: 'change_res_lightning_to_cold',
    image: changeResLightningToColdImage,
    display_name_en: 'Change Lightning Resistance to Cold Resistance',
    display_name_kor: '번개 저항 → 냉기 저항 변경',
    description_en:
      'Change a modifier that grants Lightning Resistance into a similar-tier modifier that grants Cold Resistance',
    description_kor:
      '번개 저항을 부여하는 속성 1개를 냉기 저항을 부여하는 비슷한 등급의 속성으로 변경',
  },
  {
    name: 'change_res_fire_to_lightning',
    image: changeResFireToLightningImage,
    display_name_en: 'Change Fire Resistance to Lightning Resistance',
    display_name_kor: '화염 저항 → 번개 저항 변경',
    description_en:
      'Change a modifier that grants Fire Resistance into a similar-tier modifier that grants Lightning Resistance',
    description_kor:
      '화염 저항을 부여하는 속성 1개를 번개 저항을 부여하는 비슷한 등급의 속성으로 변경',
  },
  {
    name: 'change_res_cold_to_lightning',
    image: changeResColdToLightningImage,
    display_name_en: 'Change Cold Resistance to Lightning Resistance',
    display_name_kor: '냉기 저항 → 번개 저항 변경',
    description_en:
      'Change a modifier that grants Cold Resistance into a similar-tier modifier that grants Lightning Resistance',
    description_kor:
      '냉기 저항을 부여하는 속성 1개를 번개 저항을 부여하는 비슷한 등급의 속성으로 변경',
  },

  // -----------------------------
  // Add X mod and remove random mod (non-influenced)
  // -----------------------------
  {
    name: 'add_fire_mod_and_remove_random_mod',
    image: addFireModAndRemoveRandomModImage,
    display_name_en: 'Add Fire Mod and Remove a Random Mod',
    display_name_kor: '화염 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Fire modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 화염 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_cold_mod_and_remove_random_mod',
    image: addColdModAndRemoveRandomModImage,
    display_name_en: 'Add Cold Mod and Remove a Random Mod',
    display_name_kor: '냉기 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Cold modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 냉기 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_lightning_mod_and_remove_random_mod',
    image: addLightningModAndRemoveRandomModImage,
    display_name_en: 'Add Lightning Mod and Remove a Random Mod',
    display_name_kor: '번개 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Lightning modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 번개 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_physical_mod_and_remove_random_mod',
    image: addPhysicalModAndRemoveRandomModImage,
    display_name_en: 'Add Physical Mod and Remove a Random Mod',
    display_name_kor: '물리 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Physical modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 물리 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_life_mod_and_remove_random_mod',
    image: addLifeModAndRemoveRandomModImage,
    display_name_en: 'Add Life Mod and Remove a Random Mod',
    display_name_kor: '생명력 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Life modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 생명력 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_defense_mod_and_remove_random_mod',
    image: addDefenseModAndRemoveRandomModImage,
    display_name_en: 'Add Defence Mod and Remove a Random Mod',
    display_name_kor: '방어 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Defence modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 방어 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_chaos_mod_and_remove_random_mod',
    image: addChaosModAndRemoveRandomModImage,
    display_name_en: 'Add Chaos Mod and Remove a Random Mod',
    display_name_kor: '카오스 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Chaos modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 카오스 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_attack_mod_and_remove_random_mod',
    image: addAttackModAndRemoveRandomModImage,
    display_name_en: 'Add Attack Mod and Remove a Random Mod',
    display_name_kor: '공격 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Attack modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 공격 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_caster_mod_and_remove_random_mod',
    image: addCasterModAndRemoveRandomModImage,
    display_name_en: 'Add Caster Mod and Remove a Random Mod',
    display_name_kor: '시전 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Caster modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 시전 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_speed_mod_and_remove_random_mod',
    image: addSpeedModAndRemoveRandomModImage,
    display_name_en: 'Add Speed Mod and Remove a Random Mod',
    display_name_kor: '속도 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Speed modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 속도 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
  {
    name: 'add_critical_mod_and_remove_random_mod',
    image: addCriticalModAndRemoveRandomModImage,
    display_name_en: 'Add Critical Mod and Remove a Random Mod',
    display_name_kor: '치명타 속성 추가 + 무작위 속성 제거',
    description_en:
      'Add a new Critical modifier and remove another random modifier from a non-Influenced item',
    description_kor:
      '영향을 받지 않은 아이템에 새로운 치명타 속성 1개를 부여하고 다른 속성을 무작위로 1개 제거',
  },
]
