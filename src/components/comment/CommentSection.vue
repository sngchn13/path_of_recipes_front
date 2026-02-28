<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import type { Page } from '@/shared/types'
import type { CommentResponse } from '@/shared/response-types'
import type { NewCommentRequest } from '@/shared/request-types'
import { useMessage } from 'naive-ui'
import CommentItem from './CommentItem.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { NButton, NInput, NForm, NFormItem } from 'naive-ui'

const props = defineProps<{
  postId: string
}>()

const message = useMessage()
const commentPage = ref<Page<CommentResponse> | null>(null)
const currentPage = ref(1)
const pageSize = 10

const commentQueries = computed(() => ({
  page: currentPage.value,
  size: pageSize,
}))
const commentPathVars = computed(() => ({ postId: props.postId }))

const apiValues: ReactiveValues = {
  pathVariables: commentPathVars,
  queries: commentQueries,
}

const commentsAxios = pathOfRecipesApi().get(
  '/posts/{postId}/comments',
  apiValues,
  { immediate: true, registerWatch: true },
)
const { isLoading, responseData } = commentsAxios

watch(
  () => responseData.value,
  (data) => {
    commentPage.value = (data as Page<CommentResponse>) ?? null
  },
  { immediate: true },
)

const comments = computed(() => commentPage.value?.content ?? [])
const pageable = computed(
  () =>
    commentPage.value?.pageable ?? {
      page: 1,
      size: pageSize,
      totalItems: 0,
      totalPages: 0,
    },
)

const refetchComments = () => {
  return commentsAxios.execute(null)
}

// 댓글 작성 폼
const formAuthorName = ref('')
const formPassword = ref('')
const formContent = ref('')
const submitLoading = ref(false)

const handleSubmitComment = async () => {
  const content = formContent.value.trim()
  if (!content) {
    message.warning('내용을 입력하세요.')
    return
  }
  if (!formPassword.value) {
    message.warning('비밀번호를 입력하세요.')
    return
  }
  const body: NewCommentRequest = {
    authorName: formAuthorName.value.trim() || null,
    password: formPassword.value,
    parentId: null,
    content,
  }
  submitLoading.value = true
  try {
    const api = pathOfRecipesApi()
    const result = api.post(
      '/posts/{postId}/comments',
      { pathVariables: { postId: props.postId } },
      {
        immediate: false,
        callbacks: new Map([
          [
            201,
            () => {
              message.success('댓글이 등록되었습니다.')
              formContent.value = ''
              currentPage.value = 1
              void refetchComments()
            },
          ],
          [400, () => message.error('입력값을 확인해주세요.')],
          [404, () => message.error('게시글을 찾을 수 없습니다.')],
          [500, () => message.error('댓글 등록에 실패했습니다.')],
        ]),
      },
    )
    await result.execute(body)
  } finally {
    submitLoading.value = false
  }
}

const onCommentUpdated = () => {
  void refetchComments()
}

const onRepliesChanged = () => {
  void refetchComments()
}
</script>

<template>
  <section class="comment-section">
    <h3 class="comment-section__title">댓글</h3>

    <NForm class="comment-form" @submit.prevent="handleSubmitComment">
      <NFormItem label="닉네임 (선택)">
        <NInput
          v-model:value="formAuthorName"
          placeholder="비우면 익명"
          size="small"
          maxlength="50"
          show-count
          clearable
        />
      </NFormItem>
      <NFormItem label="비밀번호" required>
        <NInput
          v-model:value="formPassword"
          type="password"
          placeholder="비밀번호"
          size="small"
          show-password-on="click"
          maxlength="100"
        />
      </NFormItem>
      <NFormItem label="내용" required>
        <NInput
          v-model:value="formContent"
          type="textarea"
          placeholder="댓글을 입력하세요"
          size="small"
          :rows="3"
          maxlength="2000"
          show-count
        />
      </NFormItem>
      <NFormItem>
        <NButton type="primary" size="small" :loading="submitLoading" @click="handleSubmitComment">
          댓글 등록
        </NButton>
      </NFormItem>
    </NForm>

    <div v-if="isLoading" class="comment-loading">댓글 불러오는 중...</div>
    <template v-else>
      <ul class="comment-list">
        <li v-for="comment in comments" :key="comment.id" class="comment-list__item">
          <CommentItem
            :comment="comment"
            :post-id="postId"
            @updated="onCommentUpdated"
            @replies-changed="onRepliesChanged"
          />
        </li>
      </ul>
      <AppPagination
        v-if="pageable.totalPages > 1"
        :pageable="pageable"
        @update:page="currentPage = $event"
      />
    </template>
  </section>
</template>

<style scoped>
.comment-section {
  padding: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.comment-section__title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}

.comment-form {
  margin-bottom: 16px;
}

.comment-loading {
  padding: 12px;
  color: #9ca3af;
  font-size: 14px;
}

.comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.comment-list__item {
  margin-bottom: 12px;
}
</style>
