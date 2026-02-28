<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { ItemBase, ItemState, Rarity, Influence, Flags } from '@/shared/types'
import { itemTypes } from '@/composables/literal-item-bases'
import { HttpStatusCode, type AxiosResponse } from 'axios'
import { NSelect, NInputNumber } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import HalfOverlay from '@/components/common/HalfOverlay.vue'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'create', itemState: ItemState): void
}>()

// 폼 데이터
const selectedItemType = ref<string | null>(null)
const selectedItemBaseId = ref<number | null>(null)
const rarity = ref<Rarity>('rare')
const itemLevel = ref<number>(84)
const influences = ref<Influence[]>([])
const flags = ref<Flags>({
  corrupted: false,
  mirrored: false,
  split: false,
})

const defaultFlags = (): Flags => ({
  corrupted: false,
  mirrored: false,
  split: false,
})

const influenceList: Influence[] = [
  'elder',
  'shaper',
  'warlord',
  'crusader',
  'redeemer',
  'hunter',
]

const toggleInfluence = (inf: Influence) => {
  const set = new Set(influences.value)
  if (set.has(inf)) {
    set.delete(inf)
  } else {
    set.add(inf)
  }
  influences.value = [...set]
}

const toggleFlag = (key: keyof Flags) => {
  flags.value = { ...flags.value, [key]: !flags.value[key] }
}

const setRarity = (r: Rarity) => {
  rarity.value = r
}

// 아이템 베이스 API 호출
const itemBaseValues: ReactiveValues = {
  queries: computed(() => ({
    item_type_name: selectedItemType.value || '',
  })),
}

const itemBaseCallbacks = new Map([
  [
    HttpStatusCode.Ok,
    (res: AxiosResponse) => {
      const bases = res.data as ItemBase[]
      if (bases.length > 0 && !selectedItemBaseId.value) {
        selectedItemBaseId.value = bases[0]?.id ?? null
      }
    },
  ],
])

const {
  isLoading: isLoadingItemBases,
  responseData: itemBasesData,
  error: itemBasesError,
} = pathOfRecipesApi().get('/item-bases', itemBaseValues, {
  immediate: false,
  registerWatch: true,
  callbacks: itemBaseCallbacks,
})

const itemBases = computed<ItemBase[]>(() => {
  if (!itemBasesData.value || !Array.isArray(itemBasesData.value)) {
    return []
  }
  return itemBasesData.value as ItemBase[]
})

// 아이템 타입이 변경되면 아이템 베이스 목록 로드
watch(selectedItemType, (newType) => {
  if (newType) {
    selectedItemBaseId.value = null
    const { execute } = pathOfRecipesApi().get('/item-bases', itemBaseValues, {
      immediate: false,
      registerWatch: false,
      callbacks: itemBaseCallbacks,
    })
    execute(null)
  }
})

// 선택된 아이템 베이스 객체 가져오기
const selectedItemBase = computed<ItemBase | null>(() => {
  if (!selectedItemBaseId.value) {
    return null
  }
  return itemBases.value.find((base) => base.id === selectedItemBaseId.value) ?? null
})

// 모달이 열릴 때 초기화
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      selectedItemType.value = null
      selectedItemBaseId.value = null
      rarity.value = 'rare'
      itemLevel.value = 84
      influences.value = []
      flags.value = defaultFlags()
    }
  },
)

const handleClose = () => {
  emit('update:show', false)
}

const handleCreate = () => {
  if (!selectedItemBase.value) {
    return
  }

  const newItemState: ItemState = {
    item_base: selectedItemBase.value,
    context: '',
    rarity: rarity.value,
    item_level: itemLevel.value,
    note: '',
    mods: [],
    influences: influences.value,
    flags: flags.value,
  }

  emit('create', newItemState)
  handleClose()
}

const canCreate = computed(() => {
  return selectedItemBaseId.value !== null && itemLevel.value > 0
})
</script>

<template>
  <HalfOverlay
    :show="show"
    title="새 노드 생성"
    @close="handleClose"
  >
    <template #header-actions>
      <button type="button" class="overlay-btn" @click="handleClose">취소</button>
      <button
        type="button"
        class="overlay-btn overlay-btn--primary"
        :disabled="!canCreate"
        @click="handleCreate"
      >
        생성
      </button>
    </template>

    <div class="create-node-form tab-content">
      <div class="section-title">아이템 타입</div>
      <div class="form-field">
        <NSelect
          v-model:value="selectedItemType"
          :options="
            itemTypes.map((type) => ({
              label: type.display_kor,
              value: type.name,
            }))
          "
          placeholder="아이템 타입을 선택하세요"
          filterable
          class="dark-select"
        />
      </div>

      <div class="section-title">아이템 베이스</div>
      <div class="form-field">
        <LoadingPanel v-if="isLoadingItemBases && selectedItemType" />
        <ErrorPanel
          v-else-if="itemBasesError && selectedItemType"
          :message="
            itemBasesError?.message ??
            (typeof itemBasesError === 'string'
              ? itemBasesError
              : '아이템 베이스를 불러오는 중 오류가 발생했습니다')
          "
        />
        <NSelect
          v-else-if="selectedItemType"
          v-model:value="selectedItemBaseId"
          :options="
            itemBases.map((base) => ({
              label: base.display_kor || base.display_en || base.name,
              value: base.id,
            }))
          "
          placeholder="아이템 베이스를 선택하세요"
          filterable
          :disabled="isLoadingItemBases || !!itemBasesError"
          class="dark-select"
        />
        <span v-else class="form-hint">먼저 아이템 타입을 선택하세요</span>
      </div>

      <div class="section-title">등급 (Rarity)</div>
      <div class="toggle-row">
        <button
          type="button"
          class="state-toggle rarity-toggle rarity-toggle--normal"
          :class="{ active: rarity === 'normal' }"
          @click="setRarity('normal')"
        >
          Normal
        </button>
        <button
          type="button"
          class="state-toggle rarity-toggle rarity-toggle--magic"
          :class="{ active: rarity === 'magic' }"
          @click="setRarity('magic')"
        >
          Magic
        </button>
        <button
          type="button"
          class="state-toggle rarity-toggle rarity-toggle--rare"
          :class="{ active: rarity === 'rare' }"
          @click="setRarity('rare')"
        >
          Rare
        </button>
      </div>

      <div class="section-title">아이템 레벨</div>
      <div class="form-field">
        <NInputNumber
          v-model:value="itemLevel"
          :min="1"
          :max="100"
          placeholder="아이템 레벨"
          class="dark-input-number"
        />
      </div>

      <div class="section-title">Influence</div>
      <div class="toggle-row">
        <button
          v-for="inf in influenceList"
          :key="inf"
          type="button"
          class="state-toggle"
          :class="{ active: influences.includes(inf) }"
          @click="toggleInfluence(inf)"
        >
          {{ inf }}
        </button>
      </div>

      <div class="section-title">Flags</div>
      <div class="toggle-row">
        <button
          type="button"
          class="state-toggle"
          :class="{ active: flags.corrupted }"
          @click="toggleFlag('corrupted')"
        >
          Corrupted
        </button>
        <button
          type="button"
          class="state-toggle"
          :class="{ active: flags.mirrored }"
          @click="toggleFlag('mirrored')"
        >
          Mirrored
        </button>
        <button
          type="button"
          class="state-toggle"
          :class="{ active: flags.split }"
          @click="toggleFlag('split')"
        >
          Split
        </button>
      </div>
    </div>
  </HalfOverlay>
</template>

<style scoped>
.create-node-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  margin-bottom: 4px;
}

.form-hint {
  color: #9ca3af;
  font-size: 13px;
}

/* NodeEditOverlay와 동일한 섹션·토글 스타일 */
.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.toggle-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.state-toggle {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background: rgba(15, 23, 42, 0.7);
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: capitalize;
}

.state-toggle:hover {
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

.state-toggle.active {
  background: rgba(30, 64, 175, 0.35);
  border-color: rgba(59, 130, 246, 0.5);
  color: #bfdbfe;
}

.rarity-toggle--normal.active {
  background: rgba(148, 163, 184, 0.25);
  border-color: rgba(148, 163, 184, 0.6);
  color: #e5e7eb;
}

.rarity-toggle--magic.active {
  background: rgba(88, 88, 184, 0.35);
  border-color: rgba(99, 102, 241, 0.7);
  color: #e0e7ff;
}

.rarity-toggle--rare.active {
  background: rgba(255, 170, 50, 0.35);
  border-color: rgba(251, 191, 36, 0.8);
  color: #fef3c7;
}

.overlay-btn {
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.overlay-btn:hover {
  background: rgba(15, 23, 42, 0.9);
}

.overlay-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.overlay-btn--primary {
  background: rgba(30, 64, 175, 0.5);
  border-color: rgba(59, 130, 246, 0.6);
  color: #bfdbfe;
}

.overlay-btn--primary:hover:not(:disabled) {
  background: rgba(30, 64, 175, 0.7);
  border-color: rgba(59, 130, 246, 0.8);
}

/* 다크 배경에 맞는 Naive 컴포넌트 오버라이드 */
:deep(.dark-select .n-select__trigger),
:deep(.dark-input-number .n-input__input-el) {
  background: rgba(15, 23, 42, 0.8) !important;
  border-color: rgba(75, 85, 99, 0.9);
  color: #e5e7eb;
}

:deep(.dark-select .n-select__trigger:hover),
:deep(.dark-input-number:hover .n-input__input-el) {
  border-color: rgba(148, 163, 184, 0.5);
}

:deep(.dark-input-number) {
  width: 120px;
}
</style>
