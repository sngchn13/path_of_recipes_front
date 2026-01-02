import { createRouter, createWebHistory } from 'vue-router'
import TestView from '@/views/TestView.vue'
import GraphEditorView from '@/views/GraphEditorView.vue'
import PostView from '@/views/PostView.vue'
import RecipeListView from '@/views/RecipeListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/posts',
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: RecipeListView,
    },
    {
      path: '/posts/new',
      name: 'post-new',
      component: GraphEditorView,
    },
    {
      path: '/posts/:postId',
      name: 'post',
      component: PostView,
    },
  ],
})

export default router
