<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.postId as string
</script>

<template>
  <div>
    <h1>Post View</h1>
    <p>Post ID: {{ postId }}</p>
  </div>
</template>

<style scoped></style>
