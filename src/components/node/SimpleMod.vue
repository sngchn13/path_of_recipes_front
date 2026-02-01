<script setup lang="ts">
import type { AttachedMod } from '@/shared/types'
import { useSimpleLabel } from '@/utils/mod-utils'
import { computed } from 'vue'

const props = defineProps<{
  mod: AttachedMod
}>()

const label = computed(() => useSimpleLabel(props.mod.mod_generation_type_id))
</script>

<template>
  <div class="simple-mod">
    <span class="mod-type-id" :style="{ color: label.color }">{{ label.simple }}</span>
    <span class="mod-display">{{ mod.display_kor }}</span>
    <span v-if="mod.fractured" class="mod-fractured-label">(분열됨)</span>
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
  font-weight: 500;
}

.mod-display {
  color: #f9fafb;
}

.mod-fractured-label {
  font-size: 10px;
  color: #9ca3af;
  margin-left: 4px;
}
</style>
