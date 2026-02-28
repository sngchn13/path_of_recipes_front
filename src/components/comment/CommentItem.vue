<script setup lang="ts">
import { computed, ref } from 'vue'
import { pathOfRecipesApi } from '@/utils/por-api'
import type { CommentResponse } from '@/shared/response-types'
import type { NewCommentRequest, PatchCommentRequest, NewReactionRequest } from '@/shared/request-types'
import type { Cursor } from '@/shared/types'
import { useMessage } from 'naive-ui'
import { NButton, NInput, NForm, NFormItem } from 'naive-ui'

const props = defineProps<{
  comment: CommentResponse
  postId: string
}>()

const emit = defineEmits<{
  updated: []
  repliesChanged: []
}>()

const message = useMessage()

const authorDisplay = computed(() => props.comment.authorName ?? '익명')
const isActive = computed(() => props.comment.status === 'active')

// 수정 모드
const editMode = ref(false)
const editPassword = ref('')
const editContent = ref('')

const startEdit = () => {
  editContent.value = props.comment.content ?? ''
  editPassword.value = ''
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
}

const submitEdit = async () => {
  if (!editPassword.value || !editContent.value.trim()) {
    message.warning('비밀번호와 내용을 입력하세요.')
    return
  }
  const body: PatchCommentRequest = {
    password: editPassword.value,
    content: editContent.value.trim(),
  }
  const api = pathOfRecipesApi()
  const result = api.patch(
    '/comments/{commentId}',
    { pathVariables: { commentId: String(props.comment.id) } },
    {
      immediate: false,
      callbacks: new Map([
        [200, () => { message.success('수정되었습니다.'); editMode.value = false; emit('updated') }],
        [400, () => message.error('입력값을 확인해주세요.')],
        [403, () => message.error('비밀번호가 일치하지 않습니다.')],
        [404, () => message.error('댓글을 찾을 수 없습니다.')],
        [500, () => message.error('수정에 실패했습니다.')],
      ]),
    },
  )
  await result.execute(body)
}

// 답글 보기 / 대댓글
const showReplies = ref(false)
const replies = ref<CommentResponse[]>([])
const nextCursor = ref<number | null>(null)
const repliesLoading = ref(false)

const loadReplies = async (afterId?: number) => {
  repliesLoading.value = true
  const queries: Record<string, number> = { size: 10 }
  if (afterId != null) queries['after-id'] = afterId
  try {
    const ra = pathOfRecipesApi().get(
      '/comments/{commentId}/comments',
      {
        pathVariables: { commentId: String(props.comment.id) },
        queries,
      },
      { immediate: false },
    )
    await ra.execute(null)
    const data = ra.responseData.value as Cursor<CommentResponse> | null
    if (data) {
      if (afterId == null) {
        replies.value = data.content
      } else {
        replies.value.push(...data.content)
      }
      nextCursor.value = data.nextCursor
    }
  } finally {
    repliesLoading.value = false
  }
}

const toggleReplies = () => {
  if (!showReplies.value) {
    showReplies.value = true
    replies.value = []
    nextCursor.value = null
    void loadReplies()
  } else {
    showReplies.value = false
  }
}

const loadMoreReplies = () => {
  if (nextCursor.value != null) void loadReplies(nextCursor.value)
}

// 대댓글 작성
const replyAuthorName = ref('')
const replyPassword = ref('')
const replyContent = ref('')
const replyFormOpen = ref(false)
const replySubmitLoading = ref(false)

const openReplyForm = () => {
  replyFormOpen.value = true
}

const submitReply = async () => {
  const content = replyContent.value.trim()
  if (!content || !replyPassword.value) {
    message.warning('내용과 비밀번호를 입력하세요.')
    return
  }
  const body: NewCommentRequest = {
    authorName: replyAuthorName.value.trim() || null,
    password: replyPassword.value,
    parentId: props.comment.id,
    content,
  }
  replySubmitLoading.value = true
  try {
    const api = pathOfRecipesApi()
    await api.post(
      '/posts/{postId}/comments',
      { pathVariables: { postId: props.postId } },
      {
        immediate: false,
        callbacks: new Map([
          [
            201,
            () => {
              message.success('답글이 등록되었습니다.')
              replyContent.value = ''
              replyPassword.value = ''
              replyAuthorName.value = ''
              replyFormOpen.value = false
              emit('repliesChanged')
              if (showReplies.value) void loadReplies()
            },
          ],
          [400, () => message.error('입력값을 확인해주세요.')],
          [404, () => message.error('게시글을 찾을 수 없습니다.')],
          [500, () => message.error('답글 등록에 실패했습니다.')],
        ]),
      },
    ).execute(body)
  } finally {
    replySubmitLoading.value = false
  }
}

// 좋아요 / 싫어요 (commentId로 요청)
const reactionLoading = ref(false)

const sendReaction = async (commentId: number, reactionType: 'like' | 'dislike') => {
  reactionLoading.value = true
  const body: NewReactionRequest = { reactionType }
  try {
    const api = pathOfRecipesApi()
    const result = api.post(
      '/comments/{commentId}/reactions',
      { pathVariables: { commentId: String(commentId) } },
      {
        immediate: false,
        callbacks: new Map([
          [201, () => { emit('updated') }],
          [409, () => message.warning('이미 반응한 댓글입니다.')],
          [500, () => message.error('반응 등록에 실패했습니다.')],
        ]),
      },
    )
    await result.execute(body)
  } finally {
    reactionLoading.value = false
  }
}

const formatDate = (s: string) => {
  try {
    const d = new Date(s)
    return d.toLocaleString('ko-KR')
  } catch {
    return s
  }
}
</script>

<template>
  <article v-if="isActive" class="comment-item">
    <div class="comment-item__header">
      <span class="comment-item__author">{{ authorDisplay }}</span>
      <span class="comment-item__date">{{ formatDate(comment.createdAt) }}</span>
    </div>

    <div v-if="!editMode" class="comment-item__body">
      <p class="comment-item__content">{{ comment.content }}</p>
      <div class="comment-item__actions">
        <NButton
          quaternary
          size="tiny"
          :disabled="reactionLoading"
          @click="sendReaction(comment.id, 'like')"
        >
          좋아요 {{ comment.likeCount }}
        </NButton>
        <NButton
          quaternary
          size="tiny"
          :disabled="reactionLoading"
          @click="sendReaction(comment.id, 'dislike')"
        >
          싫어요 {{ comment.dislikeCount }}
        </NButton>
        <NButton quaternary size="tiny" @click="startEdit">수정</NButton>
        <NButton
          v-if="comment.replyCount > 0"
          quaternary
          size="tiny"
          @click="toggleReplies"
        >
          {{ showReplies ? '답글 숨기기' : `답글 보기 (${comment.replyCount})` }}
        </NButton>
        <NButton quaternary size="tiny" @click="openReplyForm">답글</NButton>
      </div>
    </div>

    <div v-else class="comment-item__edit">
      <NForm @submit.prevent="submitEdit">
        <NFormItem label="비밀번호">
          <NInput
            v-model:value="editPassword"
            type="password"
            size="small"
            placeholder="비밀번호"
            show-password-on="click"
          />
        </NFormItem>
        <NFormItem label="내용">
          <NInput
            v-model:value="editContent"
            type="textarea"
            size="small"
            :rows="2"
          />
        </NFormItem>
        <NFormItem>
          <NButton size="small" @click="cancelEdit">취소</NButton>
          <NButton type="primary" size="small" @click="submitEdit">저장</NButton>
        </NFormItem>
      </NForm>
    </div>

    <!-- 대댓글 작성 폼 -->
    <div v-if="replyFormOpen" class="comment-item__reply-form">
      <NForm @submit.prevent="submitReply">
        <NFormItem label="닉네임 (선택)">
          <NInput v-model:value="replyAuthorName" size="small" placeholder="익명" maxlength="50" />
        </NFormItem>
        <NFormItem label="비밀번호" required>
          <NInput
            v-model:value="replyPassword"
            type="password"
            size="small"
            show-password-on="click"
          />
        </NFormItem>
        <NFormItem label="내용" required>
          <NInput v-model:value="replyContent" type="textarea" size="small" :rows="2" />
        </NFormItem>
        <NFormItem>
          <NButton size="small" @click="replyFormOpen = false">취소</NButton>
          <NButton type="primary" size="small" :loading="replySubmitLoading" @click="submitReply">
            답글 등록
          </NButton>
        </NFormItem>
      </NForm>
    </div>

    <!-- 대댓글 목록 -->
    <div v-if="showReplies" class="comment-item__replies">
      <div v-if="repliesLoading && replies.length === 0" class="replies-loading">
        불러오는 중...
      </div>
      <template v-else>
        <div
          v-for="reply in replies"
          :key="reply.id"
          class="comment-item comment-item--reply"
        >
          <div class="comment-item__header">
            <span class="comment-item__author">{{ reply.authorName ?? '익명' }}</span>
            <span class="comment-item__date">{{ formatDate(reply.createdAt) }}</span>
          </div>
          <div class="comment-item__body">
            <p class="comment-item__content">{{ reply.content }}</p>
            <div class="comment-item__actions">
              <NButton quaternary size="tiny" :disabled="reactionLoading" @click="sendReaction(reply.id, 'like')">
                좋아요 {{ reply.likeCount }}
              </NButton>
              <NButton quaternary size="tiny" :disabled="reactionLoading" @click="sendReaction(reply.id, 'dislike')">
                싫어요 {{ reply.dislikeCount }}
              </NButton>
            </div>
          </div>
        </div>
        <NButton
          v-if="nextCursor != null"
          quaternary
          size="small"
          :loading="repliesLoading"
          class="load-more-replies"
          @click="loadMoreReplies"
        >
          더보기
        </NButton>
      </template>
    </div>
  </article>
  <article v-else class="comment-item comment-item--deleted">
    <p class="comment-item__content">삭제되었거나 보이지 않는 댓글입니다.</p>
  </article>
</template>

<style scoped>
.comment-item {
  padding: 10px 12px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.comment-item--reply {
  margin-top: 8px;
  margin-left: 24px;
}

.comment-item--deleted {
  color: #9ca3af;
  font-style: italic;
}

.comment-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-item__author {
  font-weight: 600;
  font-size: 13px;
}

.comment-item__date {
  font-size: 12px;
  color: #6b7280;
}

.comment-item__content {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.comment-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.comment-item__edit,
.comment-item__reply-form {
  margin-top: 8px;
}

.comment-item__replies {
  margin-top: 12px;
}

.replies-loading {
  padding: 8px;
  color: #9ca3af;
  font-size: 13px;
}

.load-more-replies {
  margin-top: 8px;
}
</style>
