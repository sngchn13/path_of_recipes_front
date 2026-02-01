<script setup lang="ts">
import type { Cause } from '@/shared/causes/cause-type'
import { computed } from 'vue'

const props = defineProps<{
  causes: Cause[]
}>()

const visible = computed(() => {
  return props.causes.length > 0
})

const lastCause = computed(() => {
  return props.causes[props.causes.length - 1]
})

const extraCount = computed(() => {
  return Math.max(props.causes.length - 1, 0)
})
</script>

<template>
  <div v-if="visible" class="cursor-follower-item">
    <img :src="lastCause?.image" alt="cause" />
    <span v-if="extraCount > 0" class="cursor-follower-item__badge">
      +{{ extraCount }}
    </span>
  </div>
</template>

<style scoped>
.cursor-follower-item {
  position: relative;
  transform: scale(0.5);
  transform-origin: top left;
}

.cursor-follower-item img {
  display: block;
}

.cursor-follower-item__badge {
  position: absolute;
  right: -6px;
  bottom: -6px;
  padding: 3px 6px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(30, 64, 175, 0.95);
  color: #e5e7eb;
  border: 1px solid rgba(59, 130, 246, 0.7);
  line-height: 1;
}
</style>
