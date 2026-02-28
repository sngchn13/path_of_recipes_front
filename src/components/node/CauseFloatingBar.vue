<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Cause } from '@/shared/causes/cause-type'
import { craftingBenches } from '@/shared/causes/cause-crafting-bench'
import { essences } from '@/shared/causes/cause-essence'
import { fossils } from '@/shared/causes/cause-fossil'
import { horticraftings } from '@/shared/causes/cause-horticrafting'
import { orbs } from '@/shared/causes/cause-orb'
import { useMouse } from '@/composables/mouse'
import CauseCard from '@/components/common/CauseCard.vue'

import craftingBenchTypeImage from '@/assets/images/causes/crafting_bench.webp'
import essenceTypeImage from '@/assets/images/causes/essence.webp'
import fossilTypeImage from '@/assets/images/causes/fossil.webp'
import horticraftingTypeImage from '@/assets/images/causes/horticrafting.webp'
import orbTypeImage from '@/assets/images/causes/orb.webp'

type CauseCategoryId = 'crafting_bench' | 'essence' | 'fossil' | 'horticrafting' | 'orb'

interface CauseCategory {
  id: CauseCategoryId
  label: string
  image: string
  causes: Cause[]
}

const categories: CauseCategory[] = [
  {
    id: 'crafting_bench',
    label: 'Bench',
    image: craftingBenchTypeImage,
    causes: craftingBenches,
  },
  {
    id: 'orb',
    label: 'Orb',
    image: orbTypeImage,
    causes: orbs,
  },
  {
    id: 'essence',
    label: 'Ess',
    image: essenceTypeImage,
    causes: essences,
  },
  {
    id: 'fossil',
    label: 'Fos',
    image: fossilTypeImage,
    causes: fossils,
  },
  {
    id: 'horticrafting',
    label: 'Hort',
    image: horticraftingTypeImage,
    causes: horticraftings,
  },
]

const selectedCategoryId = ref<CauseCategoryId | null>(null)

const selectedCategory = computed(() => {
  if (!selectedCategoryId.value) return null
  return categories.find((c) => c.id === selectedCategoryId.value) ?? null
})

const props = defineProps<{
  causes: Cause[]
}>()

const emit = defineEmits<{
  (e: 'select-cause', cause: Cause): void
  (e: 'clear'): void
  (e: 'create-node'): void
}>()

const handleSelectCategory = (id: CauseCategoryId) => {
  // 같은 타입을 다시 클릭하면 닫기 (토글)
  if (selectedCategoryId.value === id) {
    selectedCategoryId.value = null
  } else {
    selectedCategoryId.value = id
  }
}

const handleSelectCause = (cause: Cause) => {
  emit('select-cause', cause)
}

const handleClear = () => {
  emit('clear')
}

// 마우스 오버 시 카드 표시를 위한 상태
const hoveredCause = ref<Cause | null>(null)
const { x: mouseX, y: mouseY } = useMouse()

const handleCauseMouseEnter = (cause: Cause) => {
  hoveredCause.value = cause
}

const handleCauseMouseLeave = () => {
  hoveredCause.value = null
}
</script>

<template>
  <div class="cause-floating-bar">
    <button
      type="button"
      class="cause-floating-bar__item cause-floating-bar__item--add"
      title="새 노드"
      @click="emit('create-node')"
    >
      <span class="cause-floating-bar__add-icon">+</span>
    </button>
    <div class="cause-floating-bar__list">
      <button
        v-for="category in categories"
        :key="category.id"
        class="cause-floating-bar__item"
        :class="{ 'cause-floating-bar__item--active': selectedCategoryId === category.id }"
        type="button"
        @click="handleSelectCategory(category.id)"
      >
        <img :src="category.image" :alt="category.label" class="cause-floating-bar__item-icon" />
      </button>
    </div>

    <!-- 선택된 타입의 구체적인 cause 목록 (간단한 패널) -->
    <div v-if="selectedCategoryId && selectedCategory" class="cause-floating-bar__panel">
      <div class="cause-floating-bar__panel-header">
        <span class="cause-floating-bar__panel-title">{{ selectedCategory.label }}</span>
      </div>
      <div class="cause-floating-bar__panel-list">
        <button
          v-for="cause in selectedCategory.causes"
          :key="cause.name"
          type="button"
          class="cause-floating-bar__panel-item"
          @click="handleSelectCause(cause)"
          @mouseenter="handleCauseMouseEnter(cause)"
          @mouseleave="handleCauseMouseLeave"
        >
          <img :src="cause.image" :alt="cause.name" class="cause-floating-bar__panel-item-icon" />
          <span class="cause-floating-bar__panel-item-label">
            {{ cause.display_name_kor }}
          </span>
        </button>
      </div>
    </div>

    <button
      v-if="props.causes.length > 0"
      class="cause-floating-bar__clear"
      type="button"
      @click="handleClear"
    >
      비우기
    </button>

    <!-- 마우스 오버 시 Cause 카드 표시 -->
    <Teleport to="#teleport-destination">
      <div
        v-if="hoveredCause"
        class="cause-card-wrapper"
        :style="{
          position: 'fixed',
          left: `${mouseX + 16}px`,
          top: `${mouseY + 16}px`,
          zIndex: 10000,
          pointerEvents: 'none',
        }"
      >
        <CauseCard :cause="hoveredCause" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.cause-floating-bar {
  position: absolute;
  left: 16px;
  top: 16px;
  bottom: auto;
  width: 48px;
  border-radius: 24px;
  padding: 6px 4px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: auto;
  z-index: 20;
  backdrop-filter: blur(4px);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
  opacity: 0.6;
}

.cause-floating-bar:hover {
  background: rgba(15, 23, 42, 0.96);
  border-color: rgba(148, 163, 184, 0.7);
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.65);
  opacity: 1;
}

.cause-floating-bar__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cause-floating-bar__item {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background: radial-gradient(circle at 0 0, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.cause-floating-bar__item-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.cause-floating-bar__item--add {
  flex-shrink: 0;
}

.cause-floating-bar__add-icon {
  font-size: 22px;
  font-weight: 300;
  line-height: 1;
  color: #e5e7eb;
}

.cause-floating-bar__item--active {
  border-color: rgba(96, 165, 250, 0.9);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

.cause-floating-bar__item:hover {
  border-color: rgba(96, 165, 250, 0.9);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

.cause-floating-bar__item-label {
  font-size: 11px;
  font-weight: 600;
  color: #e5e7eb;
}

.cause-floating-bar__panel {
  position: absolute;
  left: 64px;
  top: 0;
  min-width: 220px;
  max-height: 360px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.97);
  border: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.cause-floating-bar__panel-header {
  flex-shrink: 0;
}

.cause-floating-bar__panel-title {
  font-size: 11px;
  font-weight: 600;
  color: #e5e7eb;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cause-floating-bar__panel-list {
  flex: 1;
  min-height: 0;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding-right: 4px;
}

.cause-floating-bar__panel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid rgba(55, 65, 81, 1);
  background: rgba(15, 23, 42, 0.9);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease;
}

.cause-floating-bar__panel-item:hover {
  background: rgba(30, 64, 175, 0.25);
  border-color: rgba(59, 130, 246, 0.7);
  transform: translateY(-1px);
}

.cause-floating-bar__panel-item-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.cause-floating-bar__panel-item-label {
  font-size: 11px;
  color: #e5e7eb;
  text-align: left;
}

.cause-floating-bar__clear {
  margin-top: 6px;
  width: 100%;
  padding: 6px 4px;
  border-radius: 8px;
  border: 1px solid rgba(220, 38, 38, 0.6);
  background: rgba(185, 28, 28, 0.2);
  color: #fecaca;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cause-floating-bar__clear:hover {
  background: rgba(185, 28, 28, 0.35);
  border-color: rgba(220, 38, 38, 0.8);
}

@media (max-width: 960px) {
  .cause-floating-bar {
    display: none;
  }
}
</style>
