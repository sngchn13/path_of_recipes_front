<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import { HttpStatusCode, type AxiosResponse } from 'axios'
import { NCard } from 'naive-ui'
import { computed, ref } from 'vue'
import LoadingPanel from '@/components/common/LoadingPanel.vue'
import ErrorPanel from '@/components/common/ErrorPanel.vue'

const myType = ref('gloves_dex')

const values: ReactiveValues = {
  queries: computed(() => ({
    item_type_name: myType.value,
  })),
}

const callbacks = new Map([
  [HttpStatusCode.Ok, () => console.log('received ok')],
  [HttpStatusCode.NotFound, () => console.log('receive 404')],
  [HttpStatusCode.BadRequest, (res: AxiosResponse) => console.log('bad request: ', res.data)],
])

const { isLoading, responseData, error } = pathOfRecipesApi().get('/mod-groups', values, {
  immediate: true,
  registerWatch: true,
  callbacks,
})
</script>

<template>
  <div>
    <NCard title="테스트 페이지">
      <p>테스트 페이지입니다.</p>
      <LoadingPanel v-if="isLoading" />
      <ErrorPanel
        v-else-if="error"
        :message="error?.message ?? (typeof error === 'string' ? error : '알 수 없는 에러')"
      />
      <div v-else>
        <input type="text" v-model="myType" />
        <div>{{ responseData }}</div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
