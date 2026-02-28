<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { ModGroup } from '@/shared/types'
import { computed, ref, watch } from 'vue'
import HalfOverlay from '@/components/common/HalfOverlay.vue'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'
import {
  getModGenerationTypeLabelKor,
  SECTION_DISPLAY_ORDER,
} from '@/utils/mod-utils'
import { replacePlaceholders } from '@/utils/string-utils'

const props = defineProps<{
  show: boolean
  itemTypeName: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', modGroup: ModGroup): void
}>()

const handleClose = () => {
  emit('close')
}

// API 호출
const modGroupValues: ReactiveValues = {
  queries: computed(() => ({
    item_type_name: props.itemTypeName || '',
  })),
}

const {
  isLoading: isLoadingModGroups,
  responseData: modGroupsData,
  error: modGroupsError,
} = pathOfRecipesApi().get('/mod-groups', modGroupValues, {
  immediate: false,
  registerWatch: true,
})

const modGroups = computed<ModGroup[]>(() => {
  if (!modGroupsData.value || !Array.isArray(modGroupsData.value)) {
    return []
  }
  return modGroupsData.value as ModGroup[]
})

// ModGenerationTypeId별 그룹화 (에디터 모드 추가 탭과 동일)
const modGroupsByTypeId = computed(() => {
  const grouped: Record<number, ModGroup[]> = {}
  for (const group of modGroups.value) {
    const typeId = group.mod_generation_type_id
    if (!grouped[typeId]) grouped[typeId] = []
    grouped[typeId].push(group)
  }
  return grouped
})

// 타입 노출 순서: 1, 2 먼저, 나머지 한글 라벨 순
const sortedTypeIds = computed(() => {
  const typeIds = Object.keys(modGroupsByTypeId.value).map(Number)
  return typeIds.sort((a, b) => {
    const aFirst = a === 1 || a === 2
    const bFirst = b === 1 || b === 2
    if (aFirst && !bFirst) return -1
    if (!aFirst && bFirst) return 1
    if (aFirst && bFirst) return a - b
    const labelA = getModGenerationTypeLabelKor(a) || ''
    const labelB = getModGenerationTypeLabelKor(b) || ''
    return labelA.localeCompare(labelB, 'ko')
  })
})

// 선택된 ModGenerationTypeId
const selectedTypeId = ref<number | null>(null)

// 선택된 타입 내 섹션별 정렬 (SECTION_DISPLAY_ORDER 후 알파벳 순)
const sectionOrderedBlocks = computed(() => {
  const groups = selectedTypeId.value != null ? modGroupsByTypeId.value[selectedTypeId.value] ?? [] : []
  const grouped: Record<string, ModGroup[]> = {}
  for (const group of groups) {
    const section = group.section?.trim() || 'other'
    if (!grouped[section]) grouped[section] = []
    grouped[section].push(group)
  }
  const orderSet = new Set(SECTION_DISPLAY_ORDER)
  const ordered: Array<{ section: string; groups: ModGroup[] }> = []
  for (const section of SECTION_DISPLAY_ORDER) {
    if (grouped[section]?.length) ordered.push({ section, groups: grouped[section] })
  }
  const rest = Object.keys(grouped)
    .filter((s) => !orderSet.has(s))
    .sort()
  for (const section of rest) {
    ordered.push({ section, groups: grouped[section]! })
  }
  return ordered
})

// 오버레이가 열릴 때 API 호출 및 초기화
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.itemTypeName) {
      const { execute } = pathOfRecipesApi().get('/mod-groups', modGroupValues, {
        immediate: false,
        registerWatch: false,
      })
      execute(null)
      selectedTypeId.value = null
    }
  },
)

// sortedTypeIds 로드 시 첫 번째 타입 선택
watch(
  sortedTypeIds,
  (ids) => {
    if (ids.length > 0 && selectedTypeId.value === null) {
      selectedTypeId.value = ids[0] ?? null
    }
  },
  { immediate: true },
)

const handleSelectModGroup = (modGroup: ModGroup) => {
  emit('select', modGroup)
  // 오버레이를 닫지 않고 계속 선택할 수 있게 함
}

// 모드 그룹의 첫 번째 모드의 displayKor에 replacePlaceholders 적용
const getModGroupDisplay = (modGroup: ModGroup): string => {
  const firstMod = modGroup.mods?.[0]
  if (firstMod?.display_kor) {
    return replacePlaceholders(firstMod.display_kor)
  }
  return modGroup.value
}
</script>

<template>
  <HalfOverlay
    :show="show"
    title="모드 그룹 선택"
    :subtitle="itemTypeName ? `아이템 타입: ${itemTypeName}` : undefined"
    @close="handleClose"
  >
    <div class="mod-group-select-content">
      <LoadingPanel v-if="isLoadingModGroups" />
      <ErrorPanel
        v-else-if="modGroupsError"
        :message="
          modGroupsError?.message ??
          (typeof modGroupsError === 'string' ? modGroupsError : '알 수 없는 에러')
        "
      />
      <div v-else-if="sortedTypeIds.length > 0" class="overlay-content">
        <!-- 타입 탭 (에디터 모드 추가 탭과 동일) -->
        <div class="type-tabs-wrap">
          <div class="section-title">타입</div>
          <div class="type-tabs">
            <button
              v-for="typeId in sortedTypeIds"
              :key="typeId"
              class="type-tab"
              :class="{ active: selectedTypeId === typeId }"
              type="button"
              @click="selectedTypeId = typeId"
            >
              {{ getModGenerationTypeLabelKor(typeId) || `Type ${typeId}` }}
            </button>
          </div>
        </div>

        <!-- 선택된 타입: 섹션별 가로선·라벨 + 모드 그룹 목록 -->
        <div v-if="selectedTypeId !== null" class="mod-groups-section">
          <template v-for="(block, blockIndex) in sectionOrderedBlocks" :key="block.section">
            <div v-if="blockIndex > 0" class="section-divider" />
            <div class="section-block">
              <div class="section-block-label">{{ block.section }}</div>
              <button
                v-for="modGroup in block.groups"
                :key="modGroup.id"
                class="mod-group-item"
                type="button"
                @click="handleSelectModGroup(modGroup)"
              >
                <div class="mod-group-item__value">{{ getModGroupDisplay(modGroup) }}</div>
              </button>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-message">모드 그룹이 없습니다</div>
      </div>
    </div>
  </HalfOverlay>
</template>

<style scoped>
.mod-group-select-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.type-tabs-wrap {
  flex-shrink: 0;
}

.type-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.type-tabs::-webkit-scrollbar {
  height: 6px;
}

.type-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.type-tabs::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.type-tab {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background: rgba(15, 23, 42, 0.7);
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.type-tab:hover {
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

.type-tab.active {
  background: rgba(30, 64, 175, 0.35);
  border-color: rgba(59, 130, 246, 0.5);
  color: #bfdbfe;
}

.mod-groups-section {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-divider {
  height: 1px;
  background-color: rgba(148, 163, 184, 0.2);
  margin: 12px 0;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-block-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: capitalize;
}

.mod-group-item {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.3);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.mod-group-item:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(148, 163, 184, 0.4);
}

.mod-group-item__value {
  font-size: 13px;
  color: #e5e7eb;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.empty-message {
  color: #9ca3af;
  font-size: 14px;
}
</style>
