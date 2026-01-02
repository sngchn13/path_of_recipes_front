<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { ModGroup } from '@/shared/types'
import { computed, ref, watch } from 'vue'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'
import { getModGenerationTypeLabelKor } from '@/utils/mod-utils'
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

// section별로 그룹화
const modGroupsBySection = computed(() => {
  const grouped: Record<string, ModGroup[]> = {}
  for (const group of modGroups.value) {
    const section = group.section || 'other'
    if (!grouped[section]) {
      grouped[section] = []
    }
    grouped[section].push(group)
  }
  return grouped
})

const sections = computed(() => Object.keys(modGroupsBySection.value).sort())

// 선택된 section
const selectedSection = ref<string | null>(null)

// 오버레이가 열릴 때 API 호출 및 초기화
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.itemTypeName) {
      // API 호출
      const { execute } = pathOfRecipesApi().get('/mod-groups', modGroupValues, {
        immediate: false,
        registerWatch: false,
      })
      execute(null)

      // 초기화
      selectedSection.value = null
    }
  },
)

// sections가 로드되면 "normal" 섹션을 우선 선택, 없으면 첫 번째 선택
watch(sections, (newSections) => {
  if (newSections.length > 0 && !selectedSection.value) {
    const normalIndex = newSections.indexOf('normal')
    if (normalIndex >= 0) {
      const normalSection = newSections[normalIndex]
      if (normalSection) {
        selectedSection.value = normalSection
      } else {
        selectedSection.value = newSections[0] ?? null
      }
    } else {
      selectedSection.value = newSections[0] ?? null
    }
  }
})

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
  <div v-if="show" class="overlay">
    <div class="overlay-header">
      <div class="overlay-title-block">
        <div class="overlay-title">모드 그룹 선택</div>
        <div class="overlay-subtitle">아이템 타입: {{ itemTypeName }}</div>
      </div>
      <div class="overlay-header-actions">
        <button class="overlay-close" type="button" @click="handleClose">✕</button>
      </div>
    </div>

    <div class="overlay-body">
      <LoadingPanel v-if="isLoadingModGroups" />
      <ErrorPanel
        v-else-if="modGroupsError"
        :message="
          modGroupsError?.message ??
          (typeof modGroupsError === 'string' ? modGroupsError : '알 수 없는 에러')
        "
      />
      <div v-else-if="sections.length > 0" class="overlay-content">
        <!-- 섹션 선택 -->
        <div class="section-tabs">
          <button
            v-for="section in sections"
            :key="section"
            class="section-tab"
            :class="{ 'section-tab--active': selectedSection === section }"
            type="button"
            @click="selectedSection = section"
          >
            {{ section }}
          </button>
        </div>

        <!-- 모드 그룹 목록 -->
        <div v-if="selectedSection" class="mod-groups-list">
          <button
            v-for="modGroup in modGroupsBySection[selectedSection]"
            :key="modGroup.id"
            class="mod-group-item"
            type="button"
            @click="handleSelectModGroup(modGroup)"
          >
            <div class="mod-group-item__header">
              <span class="mod-group-item__label">
                {{ getModGenerationTypeLabelKor(modGroup.mod_generation_type_id) }}
              </span>
            </div>
            <div class="mod-group-item__value">{{ getModGroupDisplay(modGroup) }}</div>
          </button>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-message">모드 그룹이 없습니다</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 50%;
  max-width: 920px;
  background: rgba(15, 23, 42, 0.98);
  border-left: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.overlay-header {
  height: 52px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  flex-shrink: 0;
}

.overlay-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.overlay-title {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
}

.overlay-subtitle {
  font-size: 11px;
  color: #9ca3af;
}

.overlay-close {
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.overlay-close:hover {
  color: #e5e7eb;
}

.overlay-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 20px;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.section-tab {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(30, 41, 59, 0.5);
  color: #cbd5e1;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.section-tab:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(148, 163, 184, 0.5);
}

.section-tab--active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: #bfdbfe;
}

.mod-groups-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.mod-group-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mod-group-item__label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
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
