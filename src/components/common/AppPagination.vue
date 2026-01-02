<script setup lang="ts">
import type { Pageable } from '@/shared/types'
import { NButton } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  pageable: Pageable
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const currentPage = computed(() => props.pageable.page)
const totalPages = computed(() => props.pageable.totalPages)

// 표시할 페이지 번호들을 계산
const visiblePages = computed(() => {
  const pages: number[] = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    // 전체 페이지가 7개 이하면 모두 표시
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 현재 페이지를 중심으로 표시
    if (current <= 4) {
      // 앞부분: 1, 2, 3, 4, 5, ..., total
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 5) {
        pages.push(-1) // 구분자
        pages.push(total)
      }
    } else if (current >= total - 3) {
      // 뒷부분: 1, ..., total-4, total-3, total-2, total-1, total
      pages.push(1)
      if (total > 5) {
        pages.push(-1) // 구분자
      }
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 중간: 1, ..., current-1, current, current+1, ..., total
      pages.push(1)
      pages.push(-1) // 구분자
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(-1) // 구분자
      pages.push(total)
    }
  }

  return pages
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    emit('update:page', page)
  }
}

const handlePrev = () => {
  if (currentPage.value > 1) {
    handlePageChange(currentPage.value - 1)
  }
}

const handleNext = () => {
  if (currentPage.value < totalPages.value) {
    handlePageChange(currentPage.value + 1)
  }
}
</script>

<template>
  <div v-if="totalPages > 0" class="pagination">
    <NButton :disabled="currentPage === 1" size="small" @click="handlePrev"> 이전 </NButton>

    <div class="pagination__pages">
      <template v-for="(page, index) in visiblePages" :key="index">
        <NButton
          v-if="page !== -1"
          :type="page === currentPage ? 'primary' : 'default'"
          size="small"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </NButton>
        <span v-else class="pagination__ellipsis">...</span>
      </template>
    </div>

    <NButton :disabled="currentPage === totalPages" size="small" @click="handleNext">
      다음
    </NButton>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination__ellipsis {
  padding: 0 8px;
  color: #9ca3af;
  user-select: none;
}
</style>
