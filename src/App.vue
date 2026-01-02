<script setup lang="ts">
import {
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NMessageProvider,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}

const goToGraphNew = () => {
  router.push('/posts/new')
}

const goToRecipeList = () => {
  router.push('/posts')
}

// 헤더 버튼 배열
const headerButtons = ref([
  { label: '새 그래프', type: 'primary' as const, action: goToGraphNew },
  { label: '레시피 목록', type: 'default' as const, action: goToRecipeList },
])
</script>

<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <NLayoutHeader style="padding: 16px; display: flex; align-items: center; gap: 16px">
          <h2 style="margin: 0; cursor: pointer; user-select: none" @click="goToHome">
            Path of Recipes
          </h2>
          <div style="display: flex; gap: 8px; margin-left: auto">
            <NButton
              v-for="(button, index) in headerButtons"
              :key="index"
              :type="button.type"
              @click="button.action"
            >
              {{ button.label }}
            </NButton>
          </div>
        </NLayoutHeader>
        <NLayoutContent style="padding: 24px">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped></style>
