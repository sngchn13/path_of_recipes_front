<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import type { JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import Emoji from '@tiptap/extension-emoji'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = defineProps<{
  content: string
}>()

let parsed: JSONContent | undefined
try {
  parsed = JSON.parse(props.content) as JSONContent
} catch {
  parsed = undefined
}

const editor = new Editor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      codeBlock: {},
      blockquote: {},
      bulletList: {},
      orderedList: {},
    }),
    Color.configure({
      types: [TextStyle.name],
    }),
    TextStyle,
    Emoji,
    Youtube.configure({
      inline: false,
      width: 640,
      height: 360,
      controls: true,
      nocookie: false,
    }),
  ],
  content: parsed ?? undefined,
  editable: false,
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <section class="viewer-section">
    <div class="viewer-editor">
      <EditorContent :editor="editor" class="viewer-content" />
    </div>
  </section>
</template>

<style scoped>
.viewer-section {
  display: flex;
  flex-direction: column;
}

.viewer-editor {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  padding: 12px 14px;
}

.viewer-content :deep(p) {
  margin: 0 0 8px;
  line-height: 1.5;
}

.viewer-content :deep(h1) {
  font-size: 20px;
  margin: 12px 0 6px;
}

.viewer-content :deep(h2) {
  font-size: 18px;
  margin: 10px 0 6px;
}

.viewer-content :deep(h3) {
  font-size: 16px;
  margin: 8px 0 4px;
}

.viewer-content :deep(ul),
.viewer-content :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.viewer-content :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  margin: 8px 0;
  padding-left: 10px;
  color: #4b5563;
}

.viewer-content :deep(pre) {
  background-color: #f3f4f6;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>

