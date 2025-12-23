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
</script>

<template>
  <div v-if="visible" class="cursor-follower-item">
    <img :src="lastCause?.image" alt="cause" />
  </div>
</template>

<style scoped>
.cursor-follower-item {
  transform: scale(0.5);
  transform-origin: top left;
}

.cursor-follower-item img {
  display: block;
}
</style>
