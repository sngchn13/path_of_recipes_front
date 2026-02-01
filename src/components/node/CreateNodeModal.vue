<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { ItemBase, ItemState, Rarity } from '@/shared/types'
import { itemTypes } from '@/composables/literal-item-bases'
import { HttpStatusCode, type AxiosResponse } from 'axios'
import {
  NModal,
  NForm,
  NFormItem,
  NSelect,
  NInputNumber,
  NInput,
  NRadioGroup,
  NRadio,
  NButton,
  NSpace,
} from 'naive-ui'
import { computed, ref, watch } from 'vue'
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
const note = ref<string>('')

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
      note.value = ''
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
    note: note.value,
    mods: [],
    influences: [],
    flags: { corrupted: false, mirrored: false, split: false },
  }

  emit('create', newItemState)
  handleClose()
}

const canCreate = computed(() => {
  return selectedItemBaseId.value !== null && itemLevel.value > 0
})
</script>

<template>
  <NModal
    :show="show"
    preset="card"
    title="새 노드 생성"
    style="width: 600px"
    @update:show="(value) => emit('update:show', value)"
  >
    <NForm :label-width="100" label-placement="left">
      <NFormItem label="아이템 타입">
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
        />
      </NFormItem>

      <NFormItem label="아이템 베이스">
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
        />
        <span v-else class="form-hint">먼저 아이템 타입을 선택하세요</span>
      </NFormItem>

      <NFormItem label="등급">
        <NRadioGroup v-model:value="rarity">
          <NSpace>
            <NRadio value="normal">일반</NRadio>
            <NRadio value="magic">마법</NRadio>
            <NRadio value="rare">희귀</NRadio>
          </NSpace>
        </NRadioGroup>
      </NFormItem>

      <NFormItem label="아이템 레벨">
        <NInputNumber
          v-model:value="itemLevel"
          :min="1"
          :max="100"
          placeholder="아이템 레벨을 입력하세요"
          style="width: 100%"
        />
      </NFormItem>

      <NFormItem label="메모">
        <NInput
          v-model:value="note"
          type="textarea"
          placeholder="메모를 입력하세요 (선택사항)"
          :rows="3"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <NSpace justify="end">
        <NButton @click="handleClose">취소</NButton>
        <NButton type="primary" :disabled="!canCreate" @click="handleCreate"> 생성 </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.form-hint {
  color: #9ca3af;
  font-size: 13px;
}
</style>
