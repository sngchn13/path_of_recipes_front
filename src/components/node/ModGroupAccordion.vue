<script setup lang="ts">
import type { ModGroup } from '@/shared/types'
import { ref } from 'vue'

const props = defineProps<{
  modGroups: ModGroup[]
  selectedModGroupId: number | null
}>()

const expandedGroups = ref<Set<number>>(new Set())

const toggleGroup = (groupId: number, event: Event) => {
  event.stopPropagation()
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId)
  } else {
    expandedGroups.value.add(groupId)
  }
}

const isExpanded = (groupId: number) => {
  return expandedGroups.value.has(groupId)
}
</script>

<template>
  <div class="mod-group-accordion">
    <div v-for="group in modGroups" :key="group.id" class="accordion-item">
      <div class="accordion-header">
        <div class="accordion-header-content">
          <div class="group-main">{{ group.value }}</div>
          <div class="group-meta">{{ group.tags.join(', ') }} · {{ group.mods.length }} mods</div>
        </div>
        <button class="accordion-toggle" type="button" @click="toggleGroup(group.id, $event)">
          {{ isExpanded(group.id) ? '▼' : '▶' }}
        </button>
      </div>
      <div v-if="isExpanded(group.id)" class="accordion-content">
        <div class="mod-preview-list">
          <div v-for="mod in group.mods.slice(0, 5)" :key="mod.id" class="mod-preview-item">
            <span class="mod-preview-name">
              {{ mod.name_kor || mod.name_en || 'Unnamed' }}
            </span>
            <span v-if="mod.tier" class="mod-preview-tier">T{{ mod.tier }}</span>
          </div>
          <div v-if="group.mods.length > 5" class="mod-preview-more">
            +{{ group.mods.length - 5 }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mod-group-accordion {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.accordion-item {
  border-radius: 6px;
  border: 1px solid rgba(31, 41, 55, 1);
  background: rgba(15, 23, 42, 0.7);
  overflow: hidden;
  transition: all 0.15s ease;
}

.accordion-item.active {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(15, 23, 42, 0.9);
}

.accordion-header {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.accordion-header:hover {
  background: rgba(15, 23, 42, 0.9);
}

.accordion-header-content {
  flex: 1;
}

.group-main {
  color: #e5e7eb;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 2px;
}

.group-meta {
  font-size: 10px;
  color: #6b7280;
}

.accordion-toggle {
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  font-size: 10px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
  flex-shrink: 0;
}

.accordion-toggle:hover {
  color: #e5e7eb;
}

.accordion-content {
  border-top: 1px solid rgba(31, 41, 55, 1);
  background: rgba(15, 23, 42, 0.9);
  padding: 8px 12px;
}

.mod-preview-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mod-preview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  padding: 4px 0;
}

.mod-preview-name {
  color: #d1d5db;
}

.mod-preview-tier {
  color: #a5b4fc;
  font-weight: 500;
  font-size: 10px;
}

.mod-preview-more {
  font-size: 10px;
  color: #6b7280;
  font-style: italic;
  padding: 4px 0;
}
</style>
