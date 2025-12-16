<script setup lang="ts">
import { pathOfRecipesApi } from '@/utils/por-api'
import type { ReactiveValues } from '@/utils/reactive-axios/reactive-values'
import { HttpStatusCode } from 'axios'
import { NCard } from 'naive-ui'
import { computed, ref } from 'vue'

const myType = ref('gloves_dex')

const values: ReactiveValues = {
  queries: computed(() => ({
    item_type_name: myType.value,
  })),
}

const callbacks = new Map([
  [HttpStatusCode.Ok, () => console.log('received ok')],
  [HttpStatusCode.NotFound, () => console.log('receive 404')],
])

const { isLoading, responseData } = pathOfRecipesApi().get('/mod-groups', values, {
  immediate: true,
  registerWatch: true,
  callbacks,
})
</script>

<template>
  <div>
    <NCard title="테스트 페이지">
      <p>테스트 페이지입니다.</p>
      <div v-if="isLoading">로딩중!!!!!!!!!!!!!!!!</div>
      <div v-else>
        <input type="text" v-model="myType" />
        <div>{{ responseData }}</div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
