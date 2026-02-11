<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  currentColor?: string
  isActive?: boolean
  presetColors?: string[]
}>()

const emit = defineEmits<{
  'select-color': [color: string]
  'clear-color': []
}>()

const showPalette = ref(false)
const localColor = ref(props.currentColor ?? '#111827')

const togglePalette = () => {
  showPalette.value = !showPalette.value
}

const handleSelect = (color: string) => {
  localColor.value = color
  emit('select-color', color)
  showPalette.value = false
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target?.value) return
  localColor.value = target.value
  emit('select-color', target.value)
}

const handleReset = () => {
  emit('clear-color')
  showPalette.value = false
}
</script>

<template>
  <div class="color-picker">
    <button
      type="button"
      class="toolbar-btn"
      :class="{ active: isActive }"
      @click="togglePalette"
    >
      <span class="color-preview" :style="{ backgroundColor: currentColor || localColor }" />
      Text Color
    </button>

    <div v-if="showPalette" class="color-palette">
      <div class="color-row">
        <button
          v-for="color in presetColors"
          :key="color"
          type="button"
          class="color-swatch-btn"
          :class="{ active: currentColor === color }"
          :style="{ backgroundColor: color }"
          @click="handleSelect(color)"
        />
      </div>
      <div class="color-row custom-row">
        <input
          :value="localColor"
          type="color"
          class="color-input"
          @input="handleInput"
        />
        <button type="button" class="toolbar-btn small" @click="handleReset">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  position: relative;
  display: inline-block;
}

.color-preview {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}

.color-palette {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 8px;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  z-index: 20;
  min-width: 160px;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.color-row.custom-row {
  justify-content: space-between;
}

.color-swatch-btn {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  padding: 0;
  background-clip: padding-box;
}

.color-swatch-btn.active {
  box-shadow: 0 0 0 2px #111827;
}

.color-input {
  width: 42px;
  height: 24px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background-color: transparent;
}

.toolbar-btn {
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #111827;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.toolbar-btn.small {
  font-size: 11px;
}

.toolbar-btn.active {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}
</style>

