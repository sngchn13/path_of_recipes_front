<script setup lang="ts">
import type { AttachedMod } from '@/shared/types'
import SimpleMod from './SimpleMod.vue'

defineProps<{
  mods: AttachedMod[]
  showDivider?: boolean
}>()
</script>

<template>
  <div class="placement-mods">
    <div v-if="showDivider" class="placement-divider" />
    <div class="placement-mods-list">
      <SimpleMod v-for="mod in mods" :key="mod.id" :mod="mod" />
    </div>
  </div>
</template>

<style scoped>
.placement-mods {
  display: flex;
  flex-direction: column;
}

.placement-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 4px 0;
}

.placement-mods-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
