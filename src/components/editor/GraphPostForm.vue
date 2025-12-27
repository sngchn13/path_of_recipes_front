<script setup lang="ts">
import { NInput, NInputGroup, NInputGroupLabel } from 'naive-ui'

const props = withDefaults(
  defineProps<{
    title?: string
    password?: string
    titleError?: boolean
    passwordError?: boolean
  }>(),
  {
    title: '',
    password: '',
    titleError: false,
    passwordError: false,
  },
)

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'update:password', value: string): void
}>()

const handleTitleUpdate = (value: string) => {
  emit('update:title', value)
}

const handlePasswordUpdate = (value: string) => {
  emit('update:password', value)
}
</script>

<template>
  <div class="graph-post-form">
    <NInput
      :value="title"
      placeholder="제목"
      size="small"
      :status="titleError ? 'error' : undefined"
      class="graph-post-form__input graph-post-form__input--title"
      @update:value="handleTitleUpdate"
    />
    <NInput
      :value="password"
      type="password"
      placeholder="비밀번호"
      size="small"
      :status="passwordError ? 'error' : undefined"
      class="graph-post-form__input graph-post-form__input--password"
      show-password-on="click"
      @update:value="handlePasswordUpdate"
    />
  </div>
</template>

<style scoped>
.graph-post-form {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
}

.graph-post-form__input--title {
  flex: 1;
  min-width: 0;
}

.graph-post-form__input--password {
  width: 150px;
  flex-shrink: 0;
}

:deep(.n-input) {
  border: none;
  box-shadow: none;
}

:deep(.n-input:focus) {
  border: none;
  box-shadow: none;
}

:deep(.n-input__input-el) {
  font-size: 13px;
}
</style>
