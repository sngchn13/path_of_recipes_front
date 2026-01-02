<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import BoardSearchFilter, { type SearchFilter } from '@/components/common/BoardSearchFilter.vue'
import type { PostSummary } from '@/shared/response-types'
import type { Page } from '@/shared/types'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import RepresentativeNodeCard from '@/components/common/RepresentativeNodeCard.vue'
import { useMouse } from '@/composables/mouse'

// 검색 필터 상태
const searchFilter = ref<SearchFilter>({
  sortBy: null,
  sortOrder: null,
  itemTypeName: null,
  modGroupIds: [],
})

// 현재 페이지
const currentPage = ref(1)

// API 쿼리 파라미터 생성 (itemTypeName은 제외)
const queryParams = computed(() => {
  const params: Record<string, string | number | number[]> = {}

  if (searchFilter.value.sortBy) {
    // sortBy를 케밥 케이스로 변환
    const orderByMap: Record<string, string> = {
      view: 'view',
      like: 'like',
      'created-at': 'created-at',
    }
    params['order-by'] = orderByMap[searchFilter.value.sortBy] || searchFilter.value.sortBy
  }

  if (searchFilter.value.sortOrder) {
    params['direction'] = searchFilter.value.sortOrder
  }

  if (searchFilter.value.modGroupIds.length > 0) {
    params['mod-group-ids'] = searchFilter.value.modGroupIds
  }

  // 페이지 추가
  params['page'] = currentPage.value

  return params as Record<string, string | number | boolean | (string | number)[]>
})

// API 호출
const apiValues: ReactiveValues = {
  queries: queryParams,
}

const { isLoading, responseData, error } = pathOfRecipesApi().get('/posts', apiValues, {
  immediate: true,
  registerWatch: true,
})

// 응답 데이터
const postsPage = computed<Page<PostSummary> | null>(() => {
  if (!responseData.value) {
    return null
  }
  return responseData.value as Page<PostSummary>
})

const posts = computed(() => postsPage.value?.content || [])
const pageable = computed(
  () =>
    postsPage.value?.pageable || {
      page: 1,
      size: 20,
      totalItems: 0,
      totalPages: 0,
    },
)

// 필터 변경 시 페이지를 1로 리셋
watch(
  () => [searchFilter.value.sortBy, searchFilter.value.sortOrder, searchFilter.value.modGroupIds],
  () => {
    currentPage.value = 1
  },
)

// 페이지 변경 핸들러
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 라우터
const router = useRouter()

// 마우스 오버 관련
const { x: mouseX, y: mouseY } = useMouse()
const hoveredPost = ref<PostSummary | null>(null)

const handlePostMouseEnter = (post: PostSummary) => {
  hoveredPost.value = post
}

const handlePostMouseLeave = () => {
  hoveredPost.value = null
}

// 게시글 클릭 핸들러
const handlePostClick = (post: PostSummary) => {
  router.push(`/posts/${post.id}`)
}
</script>

<template>
  <div class="recipe-list-view">
    <h1>게시판</h1>
    <BoardSearchFilter v-model:filter="searchFilter" />

    <div class="recipe-list-content">
      <LoadingPanel v-if="isLoading" />
      <ErrorPanel
        v-else-if="error"
        :message="error?.message ?? (typeof error === 'string' ? error : '알 수 없는 에러')"
      />
      <div v-else-if="posts.length > 0" class="posts-list">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-item"
          @mouseenter="handlePostMouseEnter(post)"
          @mouseleave="handlePostMouseLeave"
          @click="handlePostClick(post)"
        >
          <h3>{{ post.title }}</h3>
          <p>조회수: {{ post.view }} | 좋아요: {{ post.like }} | 싫어요: {{ post.dislike }}</p>
        </div>

        <AppPagination :pageable="pageable" @update:page="handlePageChange" />
      </div>
      <div v-else class="empty-state">
        <p>게시글이 없습니다.</p>
      </div>
    </div>

    <!-- Representative Node Card -->
    <Teleport to="body">
      <div
        v-if="hoveredPost"
        class="node-card-wrapper"
        :style="{
          position: 'fixed',
          left: `${mouseX + 16}px`,
          top: `${mouseY + 16}px`,
          zIndex: 10000,
          pointerEvents: 'none',
        }"
      >
        <RepresentativeNodeCard :node="hoveredPost.representativeNode" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.recipe-list-view {
  padding: 32px;
  background: #ffffff;
  min-height: 100vh;
}

.recipe-list-view h1 {
  margin: 0 0 24px 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.recipe-list-content {
  margin-top: 24px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
}

.post-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.post-item h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
}

.post-item p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
