<script setup lang="ts">
import { computed } from 'vue'
import type { Cause } from '@/shared/causes/cause-type'
import CursorFollower from '@/components/common/CursorFollower.vue'
import CursorFollowerItem from '@/components/editor/CursorFollowerItem.vue'

const props = defineProps<{
  causes: Cause[]
}>()

const emit = defineEmits<{
  (e: 'clear'): void
}>()

// causes가 비어있으면 invisible, 하나라도 있으면 visible
const isVisible = computed(() => props.causes.length > 0)

// 노드 클릭 시 causes를 비우기 위한 함수 (외부에서 호출 가능)
const clearCauses = () => {
  emit('clear')
}

// 외부에서 clearCauses를 호출할 수 있도록 expose
defineExpose({
  clearCauses,
})
</script>

<template>
  <CursorFollower :visible="isVisible">
    <CursorFollowerItem :causes="causes" />
  </CursorFollower>
</template>

<style scoped></style>
