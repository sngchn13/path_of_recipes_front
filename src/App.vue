<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const goToTest = () => {
  router.push('/test')
}

const goToHome = () => {
  router.push('/')
}

const goToGraphNew = () => {
  router.push('/graphs/new')
}

// 헤더 버튼 배열 (플레이스홀더)
const headerButtons = ref([
  { label: '테스트 페이지', type: 'primary' as const, action: goToTest },
  { label: '새 그래프', type: 'default' as const, action: goToGraphNew },
  { label: '레시피 목록', type: 'default' as const, action: () => console.log('레시피 목록') },
  { label: '내 레시피', type: 'default' as const, action: () => console.log('내 레시피') },
  { label: '검색', type: 'default' as const, action: () => console.log('검색') },
])
</script>

<template>
  <NConfigProvider>
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
  </NConfigProvider>
</template>

<style scoped></style>
