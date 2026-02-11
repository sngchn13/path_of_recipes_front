<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import Emoji from '@tiptap/extension-emoji'
import { Editor, EditorContent } from '@tiptap/vue-3'
import TextColorPalette from '@/components/editor/TextColorPalette.vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// JSON string ↔ Tiptap JSONContent 변환 유틸
const parsedContent = computed<JSONContent | null>(() => {
  if (!props.modelValue) return null
  try {
    return JSON.parse(props.modelValue) as JSONContent
  } catch {
    return null
  }
})

const presetColors: string[] = [
  '#111827',
  '#4b5563',
  '#dc2626',
  '#ea580c',
  '#2563eb',
  '#16a34a',
  '#9333ea',
]
const currentTextColor = ref<string>('#111827')

const applyColor = (color: string) => {
  currentTextColor.value = color
  editor.chain().focus().setColor(color).run()
}

const clearColor = () => {
  currentTextColor.value = '#111827'
  editor.chain().focus().unsetColor().run()
}

const editor = new Editor({
  extensions: [
    StarterKit.configure({
      // 이미지 관련 확장은 사용하지 않음
      heading: {
        levels: [1, 2, 3],
      },
      // 코드 블록과 리스트/인용구는 기본 옵션 객체 사용
      codeBlock: {},
      blockquote: {},
      bulletList: {},
      orderedList: {},
    }),
    // 색상 마크 + 텍스트 스타일
    Color.configure({
      types: [TextStyle.name],
    }),
    TextStyle,
    // 이모지 확장
    Emoji,
    // 유튜브 임베드 노드
    Youtube.configure({
      inline: false,
      width: 640,
      height: 360,
      controls: true,
      nocookie: false,
    }),
  ],
  content: parsedContent.value ?? undefined,
  autofocus: false,
  onUpdate: ({ editor }) => {
    const json = editor.getJSON()
    emit('update:modelValue', JSON.stringify(json))
  },
})

// 외부에서 modelValue가 바뀌었을 때 에디터에 반영
watch(
  () => props.modelValue,
  (value) => {
    if (!editor || !editor.isEditable) return
    if (!value) return
    try {
      const json = JSON.parse(value) as JSONContent
      editor.commands.setContent(json)
    } catch {
      // 파싱 실패 시 기존 내용 유지
    }
  },
)

onBeforeUnmount(() => {
  editor.destroy()
})

const canUndo = computed(() => editor.can().undo())
const canRedo = computed(() => editor.can().redo())

const toggleHeading = (level: 1 | 2 | 3) => {
  editor.chain().focus().toggleHeading({ level }).run()
}

const insertYoutube = () => {
  const url = window.prompt('유튜브URL을 입력하세요.')
  if (!url) return
  const trimmed = url.trim()
  if (!trimmed) return
  editor
    .chain()
    .focus()
    .setYoutubeVideo({
      src: trimmed,
    })
    .run()
}

const showEmojiPicker = ref(false)

const emojiList = computed(() => {
  const storage = editor.storage as {
    emoji?: { emojis: Array<{ name: string; emoji?: string; shortcodes: string[] }> }
  }
  const list = storage.emoji?.emojis ?? []
  return list.slice(0, 200)
})

const insertEmojiByShortcode = (name: string) => {
  editor.chain().focus().setEmoji(name).run()
  showEmojiPicker.value = false
}

const insertHorizontalRule = () => {
  editor.chain().focus().setHorizontalRule().run()
}
</script>

<template>
  <section class="tiptap-section">
    <header class="tiptap-header">
      <h2 class="tiptap-title">포스트 본문</h2>
      <p class="tiptap-subtitle">그래프에 대한 설명이나 메모를 자유롭게 작성하세요.</p>
    </header>

    <div class="tiptap-toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        I
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        S
      </button>

      <span class="toolbar-divider" />

      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('heading', { level: 1 }) }"
        @click="toggleHeading(1)"
      >
        H1
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('heading', { level: 2 }) }"
        @click="toggleHeading(2)"
      >
        H2
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('heading', { level: 3 }) }"
        @click="toggleHeading(3)"
      >
        H3
      </button>

      <span class="toolbar-divider" />

      <!-- 텍스트 색상 팔레트 컴포넌트 -->
      <TextColorPalette
        :current-color="editor.getAttributes('textStyle').color || currentTextColor"
        :is-active="editor.isActive('textStyle')"
        :preset-colors="presetColors"
        @select-color="applyColor"
        @clear-color="clearColor"
      />

      <span class="toolbar-divider" />

      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        • List
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        1. List
      </button>

      <span class="toolbar-divider" />

      <!-- 이모지 선택 팔레트 & 수평선 -->
      <div class="emoji-picker-wrap">
        <button
          type="button"
          class="toolbar-btn"
          :class="{ active: showEmojiPicker }"
          @click="showEmojiPicker = !showEmojiPicker"
        >
          😊
        </button>
        <div v-if="showEmojiPicker" class="emoji-palette">
          <div class="emoji-grid">
            <button
              v-for="item in emojiList"
              :key="item.name"
              type="button"
              class="emoji-cell"
              :title="item.shortcodes?.[0] ?? item.name"
              @click="insertEmojiByShortcode(item.name)"
            >
              {{ item.emoji ?? `:${item.name}:` }}
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="toolbar-btn" @click="insertHorizontalRule">HR</button>

      <span class="toolbar-divider" />

      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        “Quote”
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        &lt;/&gt;
      </button>

      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('youtube') }"
        @click="insertYoutube"
      >
        <span class="icon-button">
          <span class="youtube-icon">
            <span class="youtube-play" />
          </span>
        </span>
      </button>

      <span class="toolbar-divider" />

      <button
        type="button"
        class="toolbar-btn small"
        :disabled="!canUndo"
        @click="editor.chain().focus().undo().run()"
      >
        Undo
      </button>
      <button
        type="button"
        class="toolbar-btn small"
        :disabled="!canRedo"
        @click="editor.chain().focus().redo().run()"
      >
        Redo
      </button>
    </div>

    <div class="tiptap-editor-wrapper">
      <EditorContent :editor="editor" class="tiptap-editor" />
    </div>
  </section>
</template>

<style scoped>
.tiptap-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.tiptap-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tiptap-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.tiptap-subtitle {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.tiptap-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 6px;
  background-color: #f9fafb;
}

.toolbar-btn {
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #111827;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.toolbar-btn.small {
  font-size: 11px;
}

.toolbar-btn.active {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: #e5e7eb;
  margin: 0 2px;
}

.tiptap-editor-wrapper {
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  min-height: 240px;
  max-height: 400px;
  overflow-y: auto;
}

.tiptap-editor {
  padding: 10px 12px;
  min-height: 220px;
}

.tiptap-editor :deep(p) {
  margin: 0 0 8px;
  line-height: 1.5;
}

.tiptap-editor :deep(h1) {
  font-size: 20px;
  margin: 12px 0 6px;
}

.tiptap-editor :deep(h2) {
  font-size: 18px;
  margin: 10px 0 6px;
}

.tiptap-editor :deep(h3) {
  font-size: 16px;
  margin: 8px 0 4px;
}

.tiptap-editor :deep(ul),
.tiptap-editor :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.tiptap-editor :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  margin: 8px 0;
  padding-left: 10px;
  color: #4b5563;
}

.tiptap-editor :deep(pre) {
  background-color: #f3f4f6;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.youtube-icon {
  width: 16px;
  height: 12px;
  border-radius: 4px;
  background: #ff0000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.youtube-play {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #ffffff;
  margin-left: 1px;
}

.emoji-picker-wrap {
  position: relative;
  display: inline-block;
}

.emoji-palette {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 8px;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  z-index: 20;
  max-height: 220px;
  overflow-y: auto;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.emoji-cell {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.emoji-cell:hover {
  background-color: #f3f4f6;
}
</style>
