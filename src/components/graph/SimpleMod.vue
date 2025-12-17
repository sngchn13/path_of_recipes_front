<script setup lang="ts">
import type { AttachedMod } from '@/shared/types'

defineProps<{
  mod: AttachedMod
}>()
</script>

<template>
  <div class="simple-mod">
    <span class="mod-type-id">{{ mod.modGenerationTypeId }}</span>
    <span class="mod-display">{{ mod.displayKor }}</span>
  </div>
</template>

<style scoped>
.simple-mod {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  line-height: 1.4;
}

.mod-type-id {
  color: #9ca3af;
  font-weight: 500;
}

.mod-display {
  color: #f9fafb;
}
</style>
