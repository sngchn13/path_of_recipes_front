<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface Tab {
  id: string
  label: string
  icon?: string
  closable?: boolean
}

const props = defineProps<{
  show: boolean
  title: string
  subtitle?: string
  tabs?: Tab[]
  defaultTabId?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'tab-change', tabId: string): void
  (e: 'tab-close', tabId: string): void
}>()

const activeTabId = ref<string | null>(
  props.defaultTabId || (props.tabs && props.tabs.length > 0 ? props.tabs[0].id : null),
)

// props의 defaultTabId가 변경되면 activeTabId 업데이트
watch(
  () => props.defaultTabId,
  (newDefaultTabId) => {
    if (newDefaultTabId) {
      activeTabId.value = newDefaultTabId
    }
  },
)

// 탭이 변경되면 activeTabId 업데이트
const handleTabClick = (tabId: string) => {
  activeTabId.value = tabId
  emit('tab-change', tabId)
}

const handleTabClose = (tabId: string, event: MouseEvent) => {
  event.stopPropagation()
  emit('tab-close', tabId)
}

const handleClose = () => {
  emit('close')
}

// 탭이 없으면 항상 null, 있으면 activeTabId
const currentTabId = computed(() => {
  if (!props.tabs || props.tabs.length === 0) return null
  return activeTabId.value
})
</script>

<template>
  <div v-if="show" class="half-overlay">
    <!-- 상단 헤더 -->
    <div class="half-overlay__top">
      <div class="top-title-block">
        <div class="top-title">{{ title }}</div>
        <div v-if="subtitle" class="top-subtitle">{{ subtitle }}</div>
      </div>
      <div class="top-actions">
        <slot name="header-actions" />
        <button class="top-close" type="button" @click="handleClose">✕</button>
      </div>
    </div>

    <!-- 탭 스트립 -->
    <div v-if="tabs && tabs.length > 0" class="tab-strip">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ 'tab--active': activeTabId === tab.id }"
        type="button"
        @click="handleTabClick(tab.id)"
      >
        <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.closable" class="tab-close" @click.stop="handleTabClose(tab.id, $event)">
          ×
        </span>
      </button>
    </div>

    <!-- 바디 -->
    <section class="half-overlay__body">
      <!-- 툴바 (선택사항) -->
      <div v-if="$slots.toolbar" class="body-toolbar">
        <slot name="toolbar" :currentTabId="currentTabId" />
      </div>

      <!-- 컨텐츠 -->
      <div class="body-content">
        <slot :currentTabId="currentTabId" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.half-overlay {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 50%;
  max-width: 920px;
  background: rgba(15, 23, 42, 0.98);
  border-left: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: -18px 0 40px rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
  z-index: 1000;
}

.half-overlay__top {
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(31, 41, 55, 0.9);
  background: linear-gradient(to bottom, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0.96));
  flex-shrink: 0;
}

.top-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.top-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #e5e7eb;
}

.top-subtitle {
  font-size: 11px;
  color: #9ca3af;
}

.top-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
}

.top-close {
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.top-close:hover {
  color: #e5e7eb;
}

/* 탭 스트립 */
.tab-strip {
  padding: 6px 10px 0;
  background: rgba(15, 23, 42, 0.96);
  border-bottom: 1px solid rgba(31, 41, 55, 0.9);
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.tab-strip::-webkit-scrollbar {
  height: 6px;
}

.tab-strip::-webkit-scrollbar-track {
  background: transparent;
}

.tab-strip::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.tab-strip::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

.tab {
  position: relative;
  min-width: 120px;
  max-width: 220px;
  padding: 7px 14px;
  font-size: 12px;
  color: #9ca3af;
  border-radius: 8px 8px 0 0;
  background: transparent;
  border: 1px solid transparent;
  border-bottom: none;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 1px;
  background: transparent;
  transition: background 0.15s ease;
}

.tab--active {
  color: #e5e7eb;
  background: rgba(15, 23, 42, 0.98);
  border-color: rgba(55, 65, 81, 1);
  border-bottom: 1px solid rgba(15, 23, 42, 1);
}

.tab--active::after {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(129, 140, 248, 0.9));
}

.tab:hover:not(.tab--active) {
  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
}

.tab-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-icon {
  font-size: 13px;
  opacity: 0.85;
  flex-shrink: 0;
}

.tab-close {
  margin-left: auto;
  font-size: 11px;
  color: #6b7280;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
  flex-shrink: 0;
}

.tab-close:hover {
  color: #e5e7eb;
}

/* 바디 */
.half-overlay__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: radial-gradient(circle at 0 0, #020617, #020617);
}

.body-toolbar {
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(31, 41, 55, 0.9);
  font-size: 11px;
  color: #9ca3af;
  flex-shrink: 0;
}

.body-content {
  flex: 1;
  padding: 14px 16px 16px;
  overflow-y: auto;
  font-size: 12px;
  color: #d1d5db;
  min-height: 0;
}
</style>
