<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { ItemState, ModGroup, Mod } from '@/shared/types'
import { computed, ref, watch } from 'vue'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'
import ItemSummaryCard from './ItemSummaryCard.vue'
import ModGenerationTypeSection from './ModGenerationTypeSection.vue'
import { getModGenerationTypeLabelKor } from '@/utils/mod-utils'

const props = defineProps<{
  show: boolean
  itemState: ItemState | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-mod', mod: Mod, modGroup: ModGroup): void
}>()

const handleClose = () => {
  emit('close')
}

// API 호출
const modGroupValues: ReactiveValues = {
  queries: computed(() => ({
    item_type_name: props.itemState?.item_base.item_type_name || '',
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

// 오버레이가 열릴 때 첫 번째 section 선택
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.itemState) {
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

// 선택된 섹션의 모드 그룹을 modGenerationTypeId별로 그룹화
const modGroupsByTypeId = computed(() => {
  if (!selectedSection.value) return {}
  const groups = modGroupsBySection.value[selectedSection.value] || []
  const grouped: Record<number, ModGroup[]> = {}

  for (const group of groups) {
    const typeId = group.mod_generation_type_id
    if (!grouped[typeId]) {
      grouped[typeId] = []
    }
    grouped[typeId].push(group)
  }

  return grouped
})

// modGenerationTypeId를 라벨 순서로 정렬
const sortedTypeIds = computed(() => {
  const typeIds = Object.keys(modGroupsByTypeId.value).map(Number)
  return typeIds.sort((a, b) => {
    const labelA = getModGenerationTypeLabelKor(a) || ''
    const labelB = getModGenerationTypeLabelKor(b) || ''
    return labelA.localeCompare(labelB, 'ko')
  })
})

const handleAddMod = (mod: Mod, modGroup: ModGroup) => {
  emit('add-mod', mod, modGroup)
}
</script>

<template>
  <div v-if="show && itemState" class="overlay">
    <div class="overlay-header">
      <div class="overlay-title-block">
        <div class="overlay-title">노드에 부여할 Mod 선택</div>
        <div class="overlay-subtitle">섹션을 선택하고 모드 그룹에서 원하는 Mod를 추가하세요.</div>
      </div>
      <div class="overlay-header-actions">
        <span class="chip">
          {{ itemState.item_base.item_type_name }} · iLvl {{ itemState.item_level }}
        </span>
        <button class="overlay-close" type="button" @click="handleClose">✕</button>
      </div>
    </div>

    <div class="overlay-body">
      <!-- 아이템 정보 카드 -->
      <div class="item-card-section">
        <ItemSummaryCard :item-state="itemState" />
      </div>

      <!-- 섹션 선택 -->
      <div class="section-section">
        <div class="section-title">섹션</div>
        <div v-if="isLoadingModGroups" class="loading-container">
          <LoadingPanel />
        </div>
        <ErrorPanel
          v-else-if="modGroupsError"
          :message="
            modGroupsError?.message ??
            (typeof modGroupsError === 'string'
              ? modGroupsError
              : '모드 그룹을 불러오는 중 오류가 발생했습니다')
          "
        />
        <div v-else class="section-tabs">
          <button
            v-for="section in sections"
            :key="section"
            class="section-tab"
            :class="{ active: selectedSection === section }"
            type="button"
            @click="selectedSection = section"
          >
            {{ section }}
          </button>
        </div>
      </div>

      <!-- 모드 그룹 카드들 (modGenerationTypeId별로 분리) -->
      <div v-if="selectedSection" class="mod-groups-section">
        <div class="section-title">Mod 그룹</div>
        <div
          class="mod-type-cards-container"
          :class="{
            'single-card': sortedTypeIds.length === 1,
            'two-cards': sortedTypeIds.length === 2,
            'multiple-cards': sortedTypeIds.length > 2,
          }"
        >
          <ModGenerationTypeSection
            v-for="typeId in sortedTypeIds"
            :key="typeId"
            :mod-generation-type-id="typeId"
            :mod-groups="modGroupsByTypeId[typeId] || []"
            @add-mod="handleAddMod"
          />
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-message">섹션을 선택하세요</div>
      </div>
    </div>

    <div class="overlay-footer">
      <div class="footer-info"></div>
      <div class="footer-buttons">
        <button class="btn" type="button" @click="handleClose">닫기</button>
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

.overlay-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(30, 64, 175, 0.25);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #bfdbfe;
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
  overflow: hidden;
  padding: 16px 20px;
  gap: 20px;
}

.item-card-section {
  flex-shrink: 0;
}

.section-section {
  flex-shrink: 0;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.loading-container {
  margin-top: 8px;
}

.section-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.section-tabs::-webkit-scrollbar {
  height: 6px;
}

.section-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.section-tabs::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.section-tabs::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

.section-tab {
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

.section-tab:hover {
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

.section-tab.active {
  background: rgba(30, 64, 175, 0.35);
  border-color: rgba(59, 130, 246, 0.5);
  color: #bfdbfe;
}

.mod-groups-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.mod-type-cards-container {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  align-items: stretch;
}

.mod-type-cards-container.single-card {
  justify-content: center;
}

.mod-type-cards-container.single-card > * {
  height: 100%;
  max-width: 600px;
}

.mod-type-cards-container.two-cards > * {
  min-width: calc(50% - 8px);
  max-width: calc(50% - 8px);
  flex-shrink: 0;
  height: 100%;
}

.mod-type-cards-container.multiple-cards {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.mod-type-cards-container.multiple-cards::-webkit-scrollbar {
  height: 6px;
}

.mod-type-cards-container.multiple-cards::-webkit-scrollbar-track {
  background: transparent;
}

.mod-type-cards-container.multiple-cards::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.mod-type-cards-container.multiple-cards::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

.mod-type-cards-container.multiple-cards > * {
  min-width: calc(50% - 8px);
  max-width: calc(50% - 8px);
  flex-shrink: 0;
  height: 100%;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-message {
  color: #6b7280;
  font-size: 12px;
}

.overlay-footer {
  height: 52px;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.96);
  flex-shrink: 0;
}

.footer-info {
  font-size: 11px;
  color: #9ca3af;
}

.footer-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid rgba(75, 85, 99, 1);
  background: rgba(15, 23, 42, 1);
  color: #e5e7eb;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.btn:hover:not(:disabled) {
  opacity: 0.8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
