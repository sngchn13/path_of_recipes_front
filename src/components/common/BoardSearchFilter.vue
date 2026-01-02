<script setup lang="ts">
import { NSelect, NButton } from 'naive-ui'
import { computed, ref } from 'vue'
import { itemTypes } from '@/composables/literal-item-bases'
import type { ModGroup } from '@/shared/types'
import ModGroupSelectOverlay from './ModGroupSelectOverlay.vue'
import { replacePlaceholders } from '@/utils/string-utils'

export interface SearchFilter {
  sortBy: 'view' | 'like' | 'created-at' | null
  sortOrder: 'desc' | 'asc' | null
  itemTypeName: string | null
  modGroupIds: number[]
}

const props = defineProps<{
  filter: SearchFilter
}>()

const emit = defineEmits<{
  'update:filter': [filter: SearchFilter]
}>()

const showModGroupOverlay = ref(false)
const selectedModGroups = ref<ModGroup[]>([])

// 아이템 타입 옵션
const itemTypeOptions = computed(() =>
  itemTypes.map((type) => ({
    label: type.display_kor,
    value: type.name,
  })),
)

// 정렬 기준 옵션
const sortByOptions = [
  { label: '조회수', value: 'view' },
  { label: '좋아요', value: 'like' },
  { label: '생성일', value: 'created-at' },
]

// 정렬 방향 옵션
const sortOrderOptions = [
  { label: '내림차순', value: 'desc' },
  { label: '오름차순', value: 'asc' },
]

const localFilter = computed({
  get: () => props.filter,
  set: (value) => emit('update:filter', value),
})

const handleItemTypeChange = (value: string | null) => {
  localFilter.value = {
    ...localFilter.value,
    itemTypeName: value,
    modGroupIds: [], // 아이템 타입 변경 시 모드 그룹 초기화
  }
  selectedModGroups.value = []
}

const handleModGroupSelect = (modGroup: ModGroup) => {
  // 이미 선택된 모드 그룹인지 확인
  const isAlreadySelected = selectedModGroups.value.some((mg) => mg.id === modGroup.id)
  if (!isAlreadySelected) {
    selectedModGroups.value.push(modGroup)
    localFilter.value = {
      ...localFilter.value,
      modGroupIds: [...localFilter.value.modGroupIds, modGroup.id],
    }
  }
}

const handleRemoveModGroup = (modGroupId: number) => {
  selectedModGroups.value = selectedModGroups.value.filter((mg) => mg.id !== modGroupId)
  localFilter.value = {
    ...localFilter.value,
    modGroupIds: localFilter.value.modGroupIds.filter((id) => id !== modGroupId),
  }
}

const handleOpenModGroupOverlay = () => {
  if (localFilter.value.itemTypeName) {
    showModGroupOverlay.value = true
  }
}

const handleCloseModGroupOverlay = () => {
  showModGroupOverlay.value = false
}

const canSelectModGroup = computed(() => !!localFilter.value.itemTypeName)

// 모드 그룹의 표시 텍스트 가져오기
const getModGroupDisplayText = (modGroup: ModGroup): string => {
  const firstMod = modGroup.mods?.[0]
  if (firstMod?.display_kor) {
    return replacePlaceholders(firstMod.display_kor)
  }
  return modGroup.value
}
</script>

<template>
  <div class="board-search-filter">
    <!-- 모드 그룹 필터 (크게) -->
    <div class="filter-group filter-group--main">
      <div class="filter-group-header">
        <label class="filter-group-label">모드 그룹 필터</label>
        <span class="filter-group-hint">아이템 타입 선택 후 모드 그룹을 선택하세요</span>
      </div>
      <div class="filter-group-content">
        <div class="filter-item filter-item--step">
          <label class="filter-label filter-label--step">
            <span class="step-number">1</span>
            아이템 타입
          </label>
          <NSelect
            v-model:value="localFilter.itemTypeName"
            :options="itemTypeOptions"
            placeholder="아이템 타입 선택"
            clearable
            style="width: 100%; max-width: 250px"
            size="large"
            @update:value="handleItemTypeChange"
          />
        </div>

        <div class="filter-arrow">→</div>

        <div class="filter-item filter-item--step">
          <label class="filter-label filter-label--step">
            <span class="step-number">2</span>
            모드 그룹
          </label>
          <div class="mod-group-selector">
            <NButton
              :disabled="!canSelectModGroup"
              :type="canSelectModGroup ? 'primary' : 'default'"
              size="large"
              @click="handleOpenModGroupOverlay"
            >
              {{ canSelectModGroup ? '모드 그룹 선택' : '아이템 타입을 먼저 선택하세요' }}
            </NButton>
            <div v-if="selectedModGroups.length > 0" class="selected-mod-groups">
              <div
                v-for="modGroup in selectedModGroups"
                :key="modGroup.id"
                class="selected-mod-group-tag"
              >
                <span class="tag-text">{{ getModGroupDisplayText(modGroup) }}</span>
                <button class="tag-remove" type="button" @click="handleRemoveModGroup(modGroup.id)">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 정렬 옵션 (하단에 작게) -->
    <div class="sort-options">
      <div class="sort-item">
        <label class="sort-label">정렬 기준</label>
        <NSelect
          v-model:value="localFilter.sortBy"
          :options="sortByOptions"
          placeholder="정렬 기준"
          clearable
          size="small"
          style="width: 120px"
        />
      </div>

      <div class="sort-item">
        <label class="sort-label">정렬 방향</label>
        <NSelect
          v-model:value="localFilter.sortOrder"
          :options="sortOrderOptions"
          placeholder="방향"
          clearable
          size="small"
          style="width: 120px"
        />
      </div>
    </div>

    <ModGroupSelectOverlay
      :show="showModGroupOverlay"
      :item-type-name="localFilter.itemTypeName"
      @close="handleCloseModGroupOverlay"
      @select="handleModGroupSelect"
    />
  </div>
</template>

<style scoped>
.board-search-filter {
  padding: 20px;
  background: rgba(15, 23, 42, 0.98);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* 모드 그룹 필터 그룹 (크게) */
.filter-group--main {
  width: 100%;
  max-width: 100%;
  padding: 20px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-sizing: border-box;
  overflow: hidden;
}

.filter-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filter-group-label {
  font-size: 16px;
  font-weight: 600;
  color: #e5e7eb;
}

.filter-group-hint {
  font-size: 12px;
  color: #9ca3af;
  font-style: italic;
}

.filter-group-content {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 100%;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.filter-item--step {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.filter-label {
  font-size: 12px;
  color: #cbd5e1;
  font-weight: 500;
}

.filter-label--step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 600;
}

.filter-arrow {
  font-size: 24px;
  color: #9ca3af;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.mod-group-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-mod-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-mod-group-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.tag-text {
  font-size: 13px;
  color: #f9fafb;
  font-weight: 500;
}

.tag-remove {
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.tag-remove:hover {
  color: #e5e7eb;
}

/* 정렬 옵션 (하단에 작게) */
.sort-options {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  white-space: nowrap;
}
</style>
