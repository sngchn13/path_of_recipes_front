<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { ItemState, ModGroup, Mod } from '@/shared/types'
import { HttpStatusCode, type AxiosResponse } from 'axios'
import { computed, ref, watch } from 'vue'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'

const props = defineProps<{
  show: boolean
  itemState: ItemState | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-mods', mods: Mod[], modGroup: ModGroup): void
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

// 선택된 section과 모드 그룹
const selectedSection = ref<string | null>(null)
const selectedModGroup = ref<ModGroup | null>(null)
const selectedMods = ref<Mod[]>([])

// section이 변경되면 첫 번째 그룹 선택
watch(selectedSection, (newSection) => {
  if (newSection) {
    const groups = modGroupsBySection.value[newSection]
    const firstGroup = groups?.[0]
    if (firstGroup) {
      selectedModGroup.value = firstGroup
    } else {
      selectedModGroup.value = null
    }
  } else {
    selectedModGroup.value = null
  }
  selectedMods.value = []
})

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
      selectedModGroup.value = null
      selectedMods.value = []
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

// 선택된 그룹의 모드 목록 (티어 내림차순)
const sortedMods = computed(() => {
  if (!selectedModGroup.value) return []
  const mods = [...selectedModGroup.value.mods]
  return mods.sort((a, b) => {
    // tier가 null인 경우 맨 뒤로
    if (a.tier === null && b.tier === null) return 0
    if (a.tier === null) return 1
    if (b.tier === null) return -1
    // 티어 내림차순
    return b.tier - a.tier
  })
})

const handleModToggle = (mod: Mod) => {
  const index = selectedMods.value.findIndex((m) => m.id === mod.id)
  if (index >= 0) {
    selectedMods.value.splice(index, 1)
  } else {
    selectedMods.value.push(mod)
  }
}

const isModSelected = (mod: Mod) => {
  return selectedMods.value.some((m) => m.id === mod.id)
}

const handleApply = () => {
  if (selectedMods.value.length > 0 && selectedModGroup.value) {
    emit('add-mods', selectedMods.value, selectedModGroup.value)
    handleClose()
  }
}
</script>

<template>
  <div v-if="show && itemState" class="overlay">
    <div class="overlay-header">
      <div class="overlay-title-block">
        <div class="overlay-title">노드에 부여할 Mod 선택</div>
        <div class="overlay-subtitle">먼저 모드 그룹을 고르고, 이후 구체적인 Mod를 선택하세요.</div>
      </div>
      <div class="overlay-header-actions">
        <span class="chip">
          {{ itemState.item_base.item_type_name }} · iLvl {{ itemState.item_level }}
        </span>
        <button class="overlay-close" type="button" @click="handleClose">✕</button>
      </div>
    </div>

    <div class="overlay-body">
      <!-- 왼쪽: 아이템 요약 + 섹션 / 그룹 선택 -->
      <div class="overlay-left">
        <div>
          <div class="section-title">Item</div>
          <div class="item-summary">
            <div class="item-summary-name">
              {{ itemState.item_base.display_kor || itemState.item_base.name }}
            </div>
            <div class="item-summary-sub">
              {{ itemState.item_base.display_en || itemState.item_base.name }} ·
              {{ itemState.rarity }}
            </div>
            <div class="subtle-divider"></div>
            <div class="item-summary-sub">
              아이템 레벨 {{ itemState.item_level }}<br />
              <span v-if="itemState.note">노트: {{ itemState.note }}</span>
            </div>
          </div>
        </div>

        <div>
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

        <div v-if="selectedSection">
          <div class="section-title">Mod 그룹</div>
          <div class="group-list">
            <div
              v-for="group in modGroupsBySection[selectedSection]"
              :key="group.id"
              class="group-item"
              :class="{ active: selectedModGroup?.id === group.id }"
              @click="selectedModGroup = group"
            >
              <div class="group-main">{{ group.value }}</div>
              <div class="group-meta">
                {{ group.tags.join(', ') }} · {{ group.mods.length }} mods
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 선택된 그룹의 Mod 리스트 -->
      <div class="overlay-right">
        <div class="overlay-right-header">
          <div>
            <div class="section-title">Mod 리스트</div>
            <div v-if="selectedModGroup" class="overlay-right-subtitle">
              선택된 그룹: <span>{{ selectedModGroup.value }}</span>
            </div>
          </div>
        </div>

        <div v-if="!selectedModGroup" class="mod-list-empty">왼쪽에서 모드 그룹을 선택하세요</div>
        <div v-else class="mod-list">
          <div
            v-for="mod in sortedMods"
            :key="mod.id"
            class="mod-card"
            :class="{ selected: isModSelected(mod) }"
            @click="handleModToggle(mod)"
          >
            <div class="mod-card-header">
              <div class="mod-name">
                {{ mod.name_kor || mod.name_en || 'Unnamed' }}
                <span v-if="mod.name_kor && mod.name_en" class="mod-name-en">
                  ({{ mod.name_en }})
                </span>
              </div>
              <div class="mod-tier">
                <span v-if="mod.tier">T{{ mod.tier }}</span>
                <span v-else>No Tier</span>
              </div>
            </div>
            <div class="mod-text">{{ mod.display_kor || mod.display_en }}</div>
            <div class="mod-meta">
              <span>요구 iLvl {{ mod.req_item_level }}</span>
              <span v-if="mod.weight">weight {{ mod.weight }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overlay-footer">
      <div class="footer-info">
        선택된 Mod: <span>{{ selectedMods.length }}개</span>
      </div>
      <div class="footer-buttons">
        <button class="btn" type="button" @click="handleClose">취소</button>
        <button
          class="btn btn-primary"
          type="button"
          :disabled="selectedMods.length === 0"
          @click="handleApply"
        >
          추가하기
        </button>
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
  min-height: 0;
  overflow: hidden;
}

.overlay-left {
  width: 36%;
  min-width: 260px;
  border-right: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 12px 16px;
  gap: 12px;
  overflow-y: auto;
}

.overlay-right {
  flex: 1;
  padding: 12px 16px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-summary {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: radial-gradient(circle at 0 0, #111827, #020617);
  font-size: 12px;
  line-height: 1.4;
  margin-top: 4px;
}

.item-summary-name {
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.item-summary-sub {
  color: #9ca3af;
  font-size: 11px;
}

.subtle-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(148, 163, 184, 0.4), transparent);
  margin: 4px 0 6px;
}

.loading-container {
  margin-top: 8px;
}

.section-tabs {
  display: flex;
  gap: 6px;
  margin-top: 8px;
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

.group-list {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 6px;
  border: 1px solid rgba(31, 41, 55, 1);
  background: rgba(15, 23, 42, 0.7);
  margin-top: 8px;
}

.group-item {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(31, 41, 55, 1);
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.group-item:last-child {
  border-bottom: none;
}

.group-item:hover {
  background: rgba(15, 23, 42, 0.9);
}

.group-item.active {
  background: rgba(30, 64, 175, 0.35);
  border-left: 2px solid #60a5fa;
}

.group-main {
  color: #e5e7eb;
  font-weight: 500;
  margin-bottom: 2px;
}

.group-meta {
  font-size: 10px;
  color: #6b7280;
}

.overlay-right-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overlay-right-subtitle {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

.overlay-right-subtitle span {
  color: #e5e7eb;
}

.mod-list-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 12px;
}

.mod-list {
  flex: 1;
  min-height: 0;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid rgba(31, 41, 55, 1);
  background: rgba(15, 23, 42, 0.9);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.mod-card {
  border-radius: 5px;
  border: 1px solid rgba(55, 65, 81, 1);
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mod-card:hover {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 1);
}

.mod-card.selected {
  background: rgba(30, 64, 175, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
}

.mod-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.mod-name {
  font-weight: 600;
  color: #e5e7eb;
}

.mod-name-en {
  font-weight: 400;
  color: #9ca3af;
  font-size: 11px;
}

.mod-tier {
  font-size: 11px;
  color: #a5b4fc;
  font-weight: 500;
}

.mod-text {
  font-size: 12px;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.mod-meta {
  font-size: 10px;
  color: #9ca3af;
  display: flex;
  justify-content: space-between;
}

.overlay-footer {
  height: 52px;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.96);
}

.footer-info {
  font-size: 11px;
  color: #9ca3af;
}

.footer-info span {
  color: #e5e7eb;
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

.btn-primary {
  border-color: rgba(59, 130, 246, 1);
  background: linear-gradient(to right, rgba(37, 99, 235, 1), rgba(59, 130, 246, 1));
}
</style>
