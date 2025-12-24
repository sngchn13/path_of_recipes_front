import type { Cause } from './cause-type'

import essenceOfAngerImage from '@/assets/images/causes/essence/essence_of_anger.webp'
import essenceOfAnguishImage from '@/assets/images/causes/essence/essence_of_anguish.webp'
import essenceOfContemptImage from '@/assets/images/causes/essence/essence_of_contempt.webp'
import essenceOfDeliriumImage from '@/assets/images/causes/essence/essence_of_delirium.webp'
import essenceOfDoubtImage from '@/assets/images/causes/essence/essence_of_doubt.webp'
import essenceOfDreadImage from '@/assets/images/causes/essence/essence_of_dread.webp'
import essenceOfEnvyImage from '@/assets/images/causes/essence/essence_of_envy.webp'
import essenceOfFearImage from '@/assets/images/causes/essence/essence_of_fear.webp'
import essenceOfGreedImage from '@/assets/images/causes/essence/essence_of_greed.webp'
import essenceOfHatredImage from '@/assets/images/causes/essence/essence_of_hatred.webp'
import essenceOfHorrorImage from '@/assets/images/causes/essence/essence_of_horror.webp'
import essenceOfHysteriaImage from '@/assets/images/causes/essence/essence_of_hysteria.webp'
import essenceOfInsanityImage from '@/assets/images/causes/essence/essence_of_insanity.webp'
import essenceOfLoathingImage from '@/assets/images/causes/essence/essence_of_loathing.webp'
import essenceOfMiseryImage from '@/assets/images/causes/essence/essence_of_misery.webp'
import essenceOfRageImage from '@/assets/images/causes/essence/essence_of_rage.webp'
import essenceOfScornImage from '@/assets/images/causes/essence/essence_of_scorn.webp'
import essenceOfSorrowImage from '@/assets/images/causes/essence/essence_of_sorrow.webp'
import essenceOfSpiteImage from '@/assets/images/causes/essence/essence_of_spite.webp'
import essenceOfSufferingImage from '@/assets/images/causes/essence/essence_of_suffering.webp'
import essenceOfTormentImage from '@/assets/images/causes/essence/essence_of_torment.webp'
import essenceOfWoeImage from '@/assets/images/causes/essence/essence_of_woe.webp'
import essenceOfWrathImage from '@/assets/images/causes/essence/essence_of_wrath.webp'
import essenceOfZealImage from '@/assets/images/causes/essence/essence_of_zeal.webp'
// src/assets/images/causes/essence 기준으로 모든 에센스를 정의
export const essences: Cause[] = [
  {
    name: 'essence_of_anger',
    image: essenceOfAngerImage,
    display_name_en: 'Essence of Anger',
    display_name_kor: '분노의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Helmets, Body Armours, Boots, Gloves, Belts, Shields: +#% to Fire Resistance\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Fire Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Fire Damage\nAmulets, Rings: #% increased Fire Damage',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 투구, 갑옷, 장화, 장갑, 허리띠, 방패: 화염 저항 +#%\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 화염 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 화염 피해 #~# 추가\n목걸이, 반지: 화염 피해 #% 증가',
  },

  {
    name: 'essence_of_anguish',
    image: essenceOfAnguishImage,
    display_name_en: 'Essence of Anguish',
    display_name_kor: '비통의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 75 and below\nQuivers, Amulets, Rings: Adds #~# to #~# Fire Damage to Attacks\nHelmets, Boots, Belts: #% chance to Avoid being Ignited\nBody Armours, Shields: #% chance to Avoid Fire Damage from Hits\nGloves: Adds #~# to #~# Fire Damage to Attacks\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Fire Damage to Spells\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Fire Damage to Spells',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 75 이하로 제한됩니다\n화살통, 목걸이, 반지: 공격 시 화염 피해 #~# 추가\n투구, 장화, 허리띠: 점화 회피 확률 #%\n갑옷, 방패: 피격 시 화염 피해 회피 확률 #%\n장갑: 공격 시 화염 피해 #~# 추가\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 주문에 화염 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 주문에 화염 피해 #~# 추가',
  },

  {
    name: 'essence_of_contempt',
    image: essenceOfContemptImage,
    display_name_en: 'Essence of Contempt',
    display_name_kor: '경멸의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Gloves, Amulets, Rings: Adds #~# Physical Damage to Attacks\nHelmets, Body Armours, Boots, Belts, Shields: Reflects #~# Physical Damage to Melee Attackers\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Physical Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Physical Damage',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 장갑, 목걸이, 반지: 공격 시 물리 피해 #~# 추가\n투구, 갑옷, 장화, 허리띠, 방패: 근접 공격자에게 물리 피해 #~# 반사\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 물리 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 물리 피해 #~# 추가',
  },

  {
    name: 'essence_of_delirium',
    image: essenceOfDeliriumImage,
    display_name_en: 'Essence of Delirium',
    display_name_kor: '섬망의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers: 25% increased Effect of your Marks\nHelmets: +2 to Level of Socketed Aura Gems\nBody Armours: 25% reduced Chaos Damage taken over time\nBoots: Cannot be Poisoned\nGloves: Socketed Gems deal 30% more Damage over Time\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Your Hits inflict Decay, dealing 700 Chaos Damage per second for 8 seconds\nBelts: +50% to Chaos Resistance during any Flask Effect\nAmulets: (6—7)% Chance to Block Spell Damage\nRings: +(12—15)% to Damage over Time Multiplier\nShields: +15% Chance to Block Spell Damage while on Low Life',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통: 내 징표 효과 25% 증가\n투구: 장착된 오라 젬 레벨 +2\n갑옷: 지속 카오스 피해 25% 감폭\n장화: 중독되지 않음\n장갑: 장착된 젬이 지속 피해 30% 더 줌\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 적중 시 부패(Decay) 부여(초당 700 카오스 피해, 8초)\n허리띠: 플라스크 효과 동안 카오스 저항 +50%\n목걸이: 주문 피해 막기 확률 (6–7)%\n반지: 지속 피해 배율 +(12–15)%\n방패: 저생명력 상태에서 주문 피해 막기 확률 +15%',
  },

  {
    name: 'essence_of_doubt',
    image: essenceOfDoubtImage,
    display_name_en: 'Essence of Doubt',
    display_name_kor: '의심의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Bows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: +# to Accuracy Rating\nHelmets, Body Armours, Boots, Gloves, Shields: +# to Evasion Rating\nBelts, Rings: +# to Evasion Rating\nAmulets: #% increased Evasion Rating',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 정확도 +#\n투구, 갑옷, 장화, 장갑, 방패: 회피도 +#\n허리띠, 반지: 회피도 +#\n목걸이: 회피도 #% 증가',
  },

  {
    name: 'essence_of_dread',
    image: essenceOfDreadImage,
    display_name_en: 'Essence of Dread',
    display_name_kor: '불안의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers, Wands: #% increased Projectile Speed\nHelmets, Body Armours, Boots, Gloves, Belts, Rings, Shields: +# to Armour\nBows: +# to Level of Socketed Bow Gems\nStaves, Two Hand Swords, Two Hand Axes, Two Hand Maces: #% increased Impale Effect\nClaws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: #% increased Impale Effect\nAmulets: #% increased Armour',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통, 마법봉: 투사체 속도 #% 증가\n투구, 갑옷, 장화, 장갑, 허리띠, 반지, 방패: 방어도 +#\n활: 장착된 활 젬 레벨 +#\n지팡이, 양손 검, 양손 도끼, 양손 철퇴: 꿰뚫기 효과 #% 증가\n클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 꿰뚫기 효과 #% 증가\n목걸이: 방어도 #% 증가',
  },

  {
    name: 'essence_of_envy',
    image: essenceOfEnvyImage,
    display_name_en: 'Essence of Envy',
    display_name_kor: '선망의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers: Adds #~# to #~# Chaos Damage to Attacks\nHelmets, Body Armours, Boots, Gloves, Belts, Shields: +#% to Chaos Resistance\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Chaos Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Chaos Damage\nAmulets, Rings: #% increased Chaos Damage',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통: 공격 시 카오스 피해 #~# 추가\n투구, 갑옷, 장화, 장갑, 허리띠, 방패: 카오스 저항 +#%\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 카오스 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 카오스 피해 #~# 추가\n목걸이, 반지: 카오스 피해 #% 증가',
  },

  {
    name: 'essence_of_fear',
    image: essenceOfFearImage,
    display_name_en: 'Essence of Fear',
    display_name_kor: '두려움의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Amulets, Rings: Minions have #% increased Movement Speed\nHelmets, Gloves: Minions deal #% increased Damage\nBody Armours, Boots, Belts, Shields: Minions have #% increased maximum Life\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Minions deal #% increased Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Minions deal #% increased Damage',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 목걸이, 반지: 소환수 이동 속도 #% 증가\n투구, 장갑: 소환수 피해 #% 증가\n갑옷, 장화, 허리띠, 방패: 소환수 생명력 최대치 #% 증가\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 소환수 피해 #% 증가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 소환수 피해 #% 증가',
  },

  {
    name: 'essence_of_greed',
    image: essenceOfGreedImage,
    display_name_en: 'Essence of Greed',
    display_name_kor: '탐욕의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers: #% of Physical Attack Damage Leeched as Life\nHelmets, Boots, Gloves: +# to maximum Life\nBody Armours, Shields: +# to maximum Life\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: #% of Physical Attack Damage Leeched as Life\nBelts: #% increased Flask Life Recovery rate\nAmulets, Rings: Regenerate # Life per second',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통: 물리 공격 피해의 #%를 생명력으로 흡수\n투구, 장화, 장갑: 생명력 최대치 +#\n갑옷, 방패: 생명력 최대치 +#\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 물리 공격 피해의 #%를 생명력으로 흡수\n허리띠: 플라스크로 얻는 생명력 회복 속도 #% 증가\n목걸이, 반지: 1초마다 생명력 # 재생',
  },

  {
    name: 'essence_of_hatred',
    image: essenceOfHatredImage,
    display_name_en: 'Essence of Hatred',
    display_name_kor: '증오의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Helmets, Body Armours, Boots, Gloves, Belts, Shields: +#% to Cold Resistance\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Cold Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Cold Damage\nAmulets, Rings: #% increased Cold Damage',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 투구, 갑옷, 장화, 장갑, 허리띠, 방패: 냉기 저항 +#%\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 냉기 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 냉기 피해 #~# 추가\n목걸이, 반지: 냉기 피해 #% 증가',
  },

  {
    name: 'essence_of_horror',
    image: essenceOfHorrorImage,
    display_name_en: 'Essence of Horror',
    display_name_kor: '경악의 에센스',
    description_en:
      "Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers: 8 to 12 Added Cold Damage per Frenzy Charge\nHelmets: Socketed Gems deal 30% more Elemental Damage\nBody Armours: You take 10% reduced Extra Damage from Critical Strikes per Endurance Charge\nBoots: 5% reduced Elemental Damage Taken while stationary\nGloves: Socketed Gems have +3.5% Critical Strike Chance\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: 16% chance to gain a Power, Frenzy or Endurance Charge on Kill\nBelts: Gain Alchemist's Genius when you use a Flask\nAmulets: (15—25)% chance to Crush on Hit\nRings: 4 to 7 Added Cold Damage per Frenzy Charge\nShields: Chill Nearby Enemies when you Block",
    description_kor:
      "일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통: 격분 충전당 냉기 피해 8~12 추가\n투구: 장착된 젬이 원소 피해 30% 더 줌\n갑옷: 인내 충전당 치명타로 받는 추가 피해 10% 감폭\n장화: 정지 상태에서 받는 원소 피해 5% 감폭\n장갑: 장착된 젬 치명타 확률 +3.5%\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 처치 시 권력/격분/인내 충전 획득 확률 16%\n허리띠: 플라스크 사용 시 연금술사의 천재(Alchemist's Genius) 획득\n목걸이: 적중 시 강타(Crush) 확률 (15–25)%\n반지: 격분 충전당 냉기 피해 4~7 추가\n방패: 막기 시 주변 적 냉각",
  },

  {
    name: 'essence_of_hysteria',
    image: essenceOfHysteriaImage,
    display_name_en: 'Essence of Hysteria',
    display_name_kor: '발작의 에센스',
    description_en:
      "Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers: Gain 15% of Physical Damage as Extra Fire Damage\nHelmets: Socketed Gems deal 30% more Damage while on Low Life\nBody Armours: 25% increased Area of Effect\nBoots: Drops Burning Ground while moving, dealing 2500 Fire Damage per second for 4 seconds\nGloves: Socketed Gems deal 175 to 225 Added Fire Damage\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Cast Level 20 Fire Burst on Hit\nBelts: Damage Penetrates 5% Elemental Resistances during any Flask Effect\nAmulets: 150% increased total Recovery per second from Life Leech\nRings: Gain 10% of Physical Damage as Extra Fire Damage\nShields: Adds 60 to 100 Fire Damage if you've Blocked Recently",
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통: 물리 피해의 15%를 추가 화염 피해로 획득\n투구: 저생명력 상태에서 장착된 젬이 피해 30% 더 줌\n갑옷: 범위 효과 25% 증가\n장화: 이동 중 불타는 지면 생성(초당 2500 화염 피해, 4초)\n장갑: 장착된 젬이 화염 피해 175~225 추가\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 적중 시 20레벨 화염 폭발(Fire Burst) 시전\n허리띠: 플라스크 효과 동안 원소 저항 관통 5%\n목걸이: 생명력 흡수의 초당 총 회복량 150% 증가\n반지: 물리 피해의 10%를 추가 화염 피해로 획득\n방패: 최근 막기 성공 시 화염 피해 60~100 추가',
  },

  {
    name: 'essence_of_insanity',
    image: essenceOfInsanityImage,
    display_name_en: 'Essence of Insanity',
    display_name_kor: '광기의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers: Projectiles Pierce 2 additional Targets\nHelmets: Socketed Gems gain 50% of Physical Damage as extra Lightning Damage\nBody Armours: You gain Onslaught for 6 seconds when Hit\nBoots: 70% increased Mana Regeneration Rate while Shocked\nGloves: Socketed Gems have 16% more Attack and Cast Speed\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Triggers Level 20 Spectral Spirits when Equipped\n+3 to maximum number of Spectral Spirits\nBelts: 10% increased Movement Speed during any Flask Effect\nAmulets: 10% chance to Recover 10% of Mana when you use a Skill\nRings: You and your Minions take 40% reduced Reflected Damage\nShields: 25% chance to gain a Power Charge when you Block',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통: 투사체가 추가 대상 2개 관통\n투구: 장착된 젬이 물리 피해의 50%를 추가 번개 피해로 획득\n갑옷: 피격 시 6초 동안 맹공(Onslaught) 획득\n장화: 감전 상태에서 마나 재생률 70% 증가\n장갑: 장착된 젬 공격 및 시전 속도 16% 더 증가\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 장착 시 20레벨 유령 정령(Spectral Spirits) 발동\n유령 정령 최대 수 +3\n허리띠: 플라스크 효과 동안 이동 속도 10% 증가\n목걸이: 스킬 사용 시 10% 확률로 마나 10% 회복\n반지: 자신과 소환수가 반사 피해 40% 감폭\n방패: 막기 시 25% 확률로 권력 충전 획득',
  },

  {
    name: 'essence_of_loathing',
    image: essenceOfLoathingImage,
    display_name_en: 'Essence of Loathing',
    display_name_kor: '혐오의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 75 and below\nQuivers, Amulets: #% increased Global Critical Strike Chance\nHelmets, Body Armours: #% increased Mana Reservation Efficiency of Skills\nBoots: #% chance to Avoid Elemental Ailments\nGloves, Rings: #% increased Global Critical Strike Chance\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: #% increased Critical Strike Chance\nBelts: #% increased Stun Duration on Enemies\nShields: #% increased Chance to Block',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 75 이하로 제한됩니다\n화살통, 목걸이: 전역 치명타 확률 #% 증가\n투구, 갑옷: 스킬 마나 점유 효율 #% 증가\n장화: 원소 상태 이상 회피 확률 #%\n장갑, 반지: 전역 치명타 확률 #% 증가\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 치명타 확률 #% 증가\n허리띠: 적 기절 지속시간 #% 증가\n방패: 막기 확률 #% 증가',
  },

  {
    name: 'essence_of_misery',
    image: essenceOfMiseryImage,
    display_name_en: 'Essence of Misery',
    display_name_kor: '비참의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers: #% of Physical Attack Damage Leeched as Mana\nHelmets, Body Armours, Boots, Gloves: +# to maximum Mana\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: #% increased Cast Speed\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: #% increased Cast Speed\nBelts: #% increased Flask Mana Recovery rate\nAmulets, Rings, Shields: #% increased Mana Regeneration Rate',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통: 물리 공격 피해의 #%를 마나로 흡수\n투구, 갑옷, 장화, 장갑: 마나 최대치 +#\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 시전 속도 #% 증가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 시전 속도 #% 증가\n허리띠: 플라스크로 얻는 마나 회복 속도 #% 증가\n목걸이, 반지, 방패: 마나 재생률 #% 증가',
  },

  {
    name: 'essence_of_rage',
    image: essenceOfRageImage,
    display_name_en: 'Essence of Rage',
    display_name_kor: '격노의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Helmets, Body Armours, Boots, Gloves, Belts, Amulets, Rings, Shields: +# to Strength\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Damage Penetrates #% Fire Resistance\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Damage Penetrates #% Fire Resistance',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 투구, 갑옷, 장화, 장갑, 허리띠, 목걸이, 반지, 방패: 힘 +#\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 화염 저항 #% 관통\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 화염 저항 #% 관통',
  },

  {
    name: 'essence_of_scorn',
    image: essenceOfScornImage,
    display_name_en: 'Essence of Scorn',
    display_name_kor: '멸시의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers, Amulets, Rings: +#% to Global Critical Strike Multiplier\nHelmets, Boots, Gloves: #% chance to Avoid being Stunned\nBody Armours: #% increased Stun Threshold\nBows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres, Shields: #% increased Spell Critical Strike Chance\nBelts: #% reduced Enemy Stun Threshold',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통, 목걸이, 반지: 전역 치명타 배율 +#%\n투구, 장화, 장갑: 기절 회피 확률 #%\n갑옷: 기절 한계치 #% 증가\n활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터, 방패: 주문 치명타 확률 #% 증가\n허리띠: 적 기절 한계치 #% 감소',
  },

  {
    name: 'essence_of_sorrow',
    image: essenceOfSorrowImage,
    display_name_en: 'Essence of Sorrow',
    display_name_kor: '슬픔의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Helmets, Body Armours, Boots, Gloves, Belts, Amulets, Rings, Shields: +# to Dexterity\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Damage Penetrates #% Cold Resistance\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Damage Penetrates #% Cold Resistance',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 투구, 갑옷, 장화, 장갑, 허리띠, 목걸이, 반지, 방패: 민첩 +#\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 냉기 저항 #% 관통\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 냉기 저항 #% 관통',
  },

  {
    name: 'essence_of_suffering',
    image: essenceOfSufferingImage,
    display_name_en: 'Essence of Suffering',
    display_name_kor: '고통의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers, Amulets, Rings, Gloves: Adds #~# to #~# Cold Damage to Attacks\nHelmets, Boots, Belts: #% chance to Avoid being Frozen\nBody Armours, Shields: #% chance to Avoid Cold Damage from Hits\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Cold Damage to Spells\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Cold Damage to Spells',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통, 목걸이, 반지, 장갑: 공격 시 냉기 피해 #~# 추가\n투구, 장화, 허리띠: 동결 회피 확률 #%\n갑옷, 방패: 피격 시 냉기 피해 회피 확률 #%\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 주문에 냉기 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 주문에 냉기 피해 #~# 추가',
  },

  {
    name: 'essence_of_torment',
    image: essenceOfTormentImage,
    display_name_en: 'Essence of Torment',
    display_name_kor: '고문(번개)의 에센스',
    description_en:
      'Upgrades a normal item to rare or reforges a rare item, guaranteeing one property\nQuivers, Gloves, Amulets, Rings: Adds #~# to #~# Lightning Damage to Attacks\nHelmets, Boots, Belts: #% chance to Avoid being Shocked\nBody Armours, Shields: #% chance to Avoid Lightning Damage from Hits\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Lightning Damage to Spells\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Lightning Damage to Spells',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n화살통, 장갑, 목걸이, 반지: 공격 시 번개 피해 #~# 추가\n투구, 장화, 허리띠: 감전 회피 확률 #%\n갑옷, 방패: 피격 시 번개 피해 회피 확률 #%\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 주문에 번개 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 주문에 번개 피해 #~# 추가',
  },

  {
    name: 'essence_of_woe',
    image: essenceOfWoeImage,
    display_name_en: 'Essence of Woe',
    display_name_kor: '비애의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers: #% increased Damage with Bow Skills\nHelmets, Body Armours, Boots, Gloves, Shields: +# to maximum Energy Shield\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: #% increased Spell Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: #% increased Spell Damage\nBelts, Rings: +# to maximum Energy Shield\nAmulets: #% increased maximum Energy Shield',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통: 활 스킬로 주는 피해 #% 증가\n투구, 갑옷, 장화, 장갑, 방패: 에너지 보호막 최대치 +#\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 주문 피해 #% 증가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 주문 피해 #% 증가\n허리띠, 반지: 에너지 보호막 최대치 +#\n목걸이: 에너지 보호막 최대치 #% 증가',
  },

  {
    name: 'essence_of_wrath',
    image: essenceOfWrathImage,
    display_name_en: 'Essence of Wrath',
    display_name_kor: '진노의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 60 and below\nQuivers, Helmets, Body Armours, Boots, Gloves, Belts, Shields: +#% to Lightning Resistance\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Adds #~# to #~# Lightning Damage\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Adds #~# to #~# Lightning Damage\nAmulets, Rings: #% increased Lightning Damage',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 60 이하로 제한됩니다\n화살통, 투구, 갑옷, 장화, 장갑, 허리띠, 방패: 번개 저항 +#%\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 번개 피해 #~# 추가\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 번개 피해 #~# 추가\n목걸이, 반지: 번개 피해 #% 증가',
  },

  {
    name: 'essence_of_zeal',
    image: essenceOfZealImage,
    display_name_en: 'Essence of Zeal',
    display_name_kor: '열의의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 75 and below\nQuivers, Gloves, Bows, Wands, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: #% increased Attack Speed\nHelmets: #% increased Warcry Speed\nBody Armours: #% increased Totem Placement speed\nBoots: #% increased Movement Speed\nBelts: #% increased Trap and Mine Throwing Speed\nAmulets, Rings: #% increased Cast Speed\nShields: #% increased Stun and Block Recovery',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 75 이하로 제한됩니다\n화살통, 장갑, 활, 마법봉, 지팡이, 양손 검, 양손 도끼, 양손 철퇴, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 공격 속도 #% 증가\n투구: 함성 속도 #% 증가\n갑옷: 토템 설치 속도 #% 증가\n장화: 이동 속도 #% 증가\n허리띠: 덫/지뢰 투척 속도 #% 증가\n목걸이, 반지: 시전 속도 #% 증가\n방패: 기절 및 막기 회복 #% 증가',
  },

  {
    name: 'essence_of_spite',
    image: essenceOfSpiteImage,
    display_name_en: 'Essence of Spite',
    display_name_kor: '악의의 에센스',
    description_en:
      'Upgrades a normal item to rare with one guaranteed property\nProperties restricted to level 75 and below\nQuivers, Helmets, Body Armours, Boots, Gloves, Belts, Amulets, Rings, Shields: +# to Intelligence\nBows, Staves, Two Hand Swords, Two Hand Axes, Two Hand Maces: Damage Penetrates #% Lightning Resistance\nWands, Claws, Daggers, One Hand Swords, Thrusting One Hand Swords, One Hand Axes, One Hand Maces, Sceptres: Damage Penetrates #% Lightning Resistance',
    description_kor:
      '일반 아이템을 희귀 아이템으로 업그레이드 또는 희귀 아이템 재련, 아래 해당하는 속성 1개 보장\n속성 레벨이 75 이하로 제한됩니다\n화살통, 투구, 갑옷, 장화, 장갑, 허리띠, 목걸이, 반지, 방패: 지능 +#\n활, 지팡이, 양손 검, 양손 도끼, 양손 철퇴: 번개 저항 #% 관통\n마법봉, 클로, 단검, 한손 검, 날카로운 한손 검, 한손 도끼, 한손 철퇴, 셉터: 번개 저항 #% 관통',
  },
]
