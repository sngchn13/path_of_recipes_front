<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import { PathVariables } from '@/utils/reactive-axios/path-variables'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import { HttpStatusCode, type AxiosResponse } from 'axios'
import { NCard } from 'naive-ui'
import { computed, ref } from 'vue'

const myType = ref('gloves_dex')

const values: ReactiveValues = {
  pathVariables: new PathVariables(),
  queries: computed(() => ({
    item_type_name: myType.value,
  })),
  headers: {},
  data: undefined,
}

const callbacks = new Map<HttpStatusCode, (response: AxiosResponse) => void>([
  [HttpStatusCode.Ok, () => console.log('received ok')],
  [HttpStatusCode.NotFound, () => console.log('receive 404')],
])

const { responseData } = pathOfRecipesApi().get('/mod-groups', values, {
  immediate: true,
  registerWatch: true,
  callbacks,
})
</script>

<template>
  <div>
    <NCard title="테스트 페이지">
      <p>테스트 페이지입니다.</p>
      <input type="text" v-model="myType" />
      <div>{{ responseData }}</div>
    </NCard>
  </div>
</template>

<style scoped></style>
