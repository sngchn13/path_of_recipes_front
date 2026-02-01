<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type {
  ItemState,
  ModGroup,
  Mod,
  Placement,
  Influence,
  Flags,
  Rarity,
} from '@/shared/types'
import { computed, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'
import HalfOverlay, { type Tab } from '@/components/common/HalfOverlay.vue'
import ItemSummaryCard from './ItemSummaryCard.vue'
import ModGenerationTypeSection from './ModGenerationTypeSection.vue'
import DetailMod from './DetailMod.vue'
import { getModGenerationTypeLabelKor } from '@/utils/mod-utils'

const props = defineProps<{
  show: boolean
  itemState: ItemState | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-mod', mod: Mod, modGroup: ModGroup): void
  (e: 'remove-mod', modId: number): void
  (e: 'delete-node'): void
  (e: 'update-influences', influences: Influence[]): void
  (e: 'update-flags', flags: Flags): void
  (e: 'update-rarity', rarity: Rarity): void
  (e: 'update-mod-fractured', modId: number, fractured: boolean): void
}>()

const message = useMessage()

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

// 현재 노드의 모든 패밀리 수집
const currentNodeFamilies = computed(() => {
  if (!props.itemState) return new Set<string>()
  const families = new Set<string>()
  for (const mod of props.itemState.mods) {
    for (const family of mod.families) {
      families.add(family)
    }
  }
  return families
})

// 패밀리 겹침 확인 함수
const hasFamilyConflict = (modGroup: ModGroup): boolean => {
  if (currentNodeFamilies.value.size === 0) return false
  for (const family of modGroup.families) {
    if (currentNodeFamilies.value.has(family)) {
      return true
    }
  }
  return false
}

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

// 탭 정의
const tabs: Tab[] = [
  { id: 'add', label: '모드 추가', icon: '📄' },
  { id: 'remove', label: '모드 편집', icon: '✏️' },
  { id: 'state', label: '상태 변형', icon: '⚙️' },
]

const activeTabId = ref<string>('add')

const handleAddMod = (mod: Mod, modGroup: ModGroup) => {
  // 패밀리 겹침 체크
  if (hasFamilyConflict(modGroup)) {
    message.warning('이미 같은 패밀리의 모드가 노드에 존재합니다.')
    return
  }
  emit('add-mod', mod, modGroup)
}

const handleRemoveMod = (modId: number) => {
  emit('remove-mod', modId)
}

const handleFracturedChange = (modId: number, fractured: boolean) => {
  emit('update-mod-fractured', modId, fractured)
}

const handleDeleteNode = () => {
  emit('delete-node')
}

// HalfOverlay의 탭 변경 이벤트를 받아서 동기화
const handleTabChange = (tabId: string) => {
  activeTabId.value = tabId
}

// 상태 변형 탭: 현재 influences / flags (기본값 포함)
const defaultFlags = (): Flags => ({
  corrupted: false,
  mirrored: false,
  split: false,
})

const currentInfluences = computed<Influence[]>(() => {
  return props.itemState?.influences ?? []
})

const currentFlags = computed<Flags>(() => {
  return props.itemState?.flags ?? defaultFlags()
})

const currentRarity = computed<Rarity>(() => {
  return props.itemState?.rarity ?? 'normal'
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
  const set = new Set(currentInfluences.value)
  if (set.has(inf)) {
    set.delete(inf)
  } else {
    set.add(inf)
  }
  emit('update-influences', [...set])
}

const toggleFlag = (key: keyof Flags) => {
  const next = { ...currentFlags.value, [key]: !currentFlags.value[key] }
  emit('update-flags', next)
}

const setRarity = (rarity: Rarity) => {
  emit('update-rarity', rarity)
}

// 모드 제거 탭용: 현재 노드의 모드를 placement별로 그룹화
const modsByPlacementForRemove = computed(() => {
  if (!props.itemState) return []
  const grouped: Record<Placement, typeof props.itemState.mods> = {
    enchantment: [],
    implicit: [],
    explicit: [],
    others: [],
  }

  for (const mod of props.itemState.mods) {
    const placement = mod.placement
    if (grouped[placement]) {
      grouped[placement].push(mod)
    }
  }

  return (['enchantment', 'implicit', 'explicit'] as Placement[])
    .map((placement) => ({
      placement,
      mods: (grouped[placement] || []).sort(
        (a, b) => a.mod_generation_type_id - b.mod_generation_type_id,
      ),
    }))
    .filter((group) => group.mods.length > 0)
})
</script>

<template>
  <HalfOverlay
    v-if="itemState"
    :show="show"
    title="노드 편집"
    :subtitle="`${itemState.item_base.item_type_name} · iLvl ${itemState.item_level}`"
    :tabs="tabs"
    default-tab-id="add"
    @close="handleClose"
    @tab-change="handleTabChange"
  >
    <template #header-actions>
      <span class="chip">
        {{ itemState.item_base.item_type_name }} · iLvl {{ itemState.item_level }}
      </span>
      <button class="overlay-btn overlay-btn--danger" type="button" @click="handleDeleteNode">
        노드 삭제
      </button>
    </template>

    <!-- 모드 추가 탭 -->
    <div v-if="activeTabId === 'add'" class="tab-content">
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

    <!-- 상태 변형 탭 -->
    <div v-else-if="activeTabId === 'state'" class="tab-content state-transform-section">
      <div class="section-title">Rarity</div>
      <div class="toggle-row">
        <button
          type="button"
          class="state-toggle rarity-toggle rarity-toggle--normal"
          :class="{ active: currentRarity === 'normal' }"
          @click="setRarity('normal')"
        >
          Normal
        </button>
        <button
          type="button"
          class="state-toggle rarity-toggle rarity-toggle--magic"
          :class="{ active: currentRarity === 'magic' }"
          @click="setRarity('magic')"
        >
          Magic
        </button>
        <button
          type="button"
          class="state-toggle rarity-toggle rarity-toggle--rare"
          :class="{ active: currentRarity === 'rare' }"
          @click="setRarity('rare')"
        >
          Rare
        </button>
      </div>
      <div class="section-title">Influence</div>
      <div class="toggle-row">
        <button
          v-for="inf in influenceList"
          :key="inf"
          type="button"
          class="state-toggle"
          :class="{ active: currentInfluences.includes(inf) }"
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
          :class="{ active: currentFlags.corrupted }"
          @click="toggleFlag('corrupted')"
        >
          Corrupted
        </button>
        <button
          type="button"
          class="state-toggle"
          :class="{ active: currentFlags.mirrored }"
          @click="toggleFlag('mirrored')"
        >
          Mirrored
        </button>
        <button
          type="button"
          class="state-toggle"
          :class="{ active: currentFlags.split }"
          @click="toggleFlag('split')"
        >
          Split
        </button>
      </div>
    </div>

    <!-- 모드 편집 탭 -->
    <div v-else-if="activeTabId === 'remove'" class="tab-content mod-remove-section">
      <div class="section-title">현재 노드의 모드</div>
      <div v-if="modsByPlacementForRemove.length === 0" class="empty-state">
        <div class="empty-message">편집할 모드가 없습니다</div>
      </div>
      <div v-else class="mod-remove-list">
        <div
          v-for="(group, index) in modsByPlacementForRemove"
          :key="group.placement"
          class="mod-remove-group"
        >
          <div v-if="index > 0" class="placement-divider" />
          <div class="placement-header">{{ group.placement }}</div>
          <div class="mod-remove-items">
            <div v-for="mod in group.mods" :key="mod.id" class="mod-remove-item">
              <DetailMod :mod="mod" />
              <div class="mod-remove-actions">
                <label class="fractured-check">
                  <input
                    type="checkbox"
                    :checked="mod.fractured ?? false"
                    @change="handleFracturedChange(mod.id, ($event.target as HTMLInputElement).checked)"
                  />
                  <span>분열</span>
                </label>
                <button class="mod-remove-btn" type="button" @click="handleRemoveMod(mod.id)">
                  제거
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HalfOverlay>
</template>

<style scoped>
.chip {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(30, 64, 175, 0.25);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #bfdbfe;
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

.overlay-btn--danger {
  background: rgba(185, 28, 28, 0.2);
  border-color: rgba(220, 38, 38, 0.5);
  color: #fca5a5;
}

.overlay-btn--danger:hover {
  background: rgba(185, 28, 28, 0.3);
  border-color: rgba(220, 38, 38, 0.7);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.item-card-section {
  flex-shrink: 0;
}

.section-section {
  flex-shrink: 0;
}

/* 상태 변형 섹션 */
.state-transform-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

/* 모드 제거 섹션 */
.mod-remove-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mod-remove-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.mod-remove-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placement-divider {
  height: 1px;
  background-color: rgba(148, 163, 184, 0.2);
  margin: 12px 0;
}

.placement-header {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: capitalize;
  margin-bottom: 4px;
}

.mod-remove-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mod-remove-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.3);
  transition: all 0.15s ease;
}

.mod-remove-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.fractured-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
  user-select: none;
}

.fractured-check input {
  cursor: pointer;
}

.mod-remove-item:hover {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(148, 163, 184, 0.4);
}

.mod-remove-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(220, 38, 38, 0.5);
  background: rgba(185, 28, 28, 0.2);
  color: #fca5a5;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.mod-remove-btn:hover {
  background: rgba(185, 28, 28, 0.3);
  border-color: rgba(220, 38, 38, 0.7);
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
}

.mod-type-cards-container {
  display: flex;
  gap: 16px;
}

.mod-type-cards-container.single-card {
  justify-content: center;
}

.mod-type-cards-container.two-cards > * {
  min-width: calc(50% - 8px);
  max-width: calc(50% - 8px);
  flex-shrink: 0;
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
</style>
