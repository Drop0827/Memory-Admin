import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: '/setup',
          name: 'setup',
          component: () => import('@/views/setup/SetupView.vue'),
        },
        {
          path: '/file',
          name: 'file',
          component: () => import('@/views/file/index.vue'),
        },
        {
          path: '/footprint',
          name: 'footprint',
          component: () => import('@/views/footprint/index.vue'),
        },
        {
          path: '/iterative',
          name: 'iterative',
          component: () => import('@/views/iterative/index.vue'),
        },
        {
          path: '/record',
          name: 'record',
          component: () => import('@/views/record/index.vue'),
        },
        {
          path: '/storage',
          name: 'storage',
          component: () => import('@/views/storage/index.vue'),
        },
        {
          path: '/swiper',
          name: 'swiper',
          component: () => import('@/views/swiper/index.vue'),
        },
        {
          path: '/wall',
          name: 'wall',
          component: () => import('@/views/wall/index.vue'),
        },
        {
          path: '/web',
          name: 'web',
          component: () => import('@/views/web/index.vue'),
        },
        {
          path: '/my',
          name: 'my',
          component: () => import('@/views/page/MyView.vue'),
        },
        // Existing views
        {
          path: '/assistant',
          name: 'assistant',
          component: () => import('@/views/assistant/AssistantView.vue'),
        },
        {
          path: '/cate',
          name: 'cate',
          component: () => import('@/views/cate/CateView.vue'),
        },
        {
          path: '/tag',
          name: 'tag',
          component: () => import('@/views/tag/TagView.vue'),
        },
        {
          path: '/comment',
          name: 'comment',
          component: () => import('@/views/comment/CommentView.vue'),
        },
        {
          path: '/config',
          name: 'config',
          component: () => import('@/views/config/ConfigView.vue'),
        },
        {
          path: '/create',
          name: 'create',
          component: () => import('@/views/create/CreateView.vue'),
        },
        // Re-implementing deleted routes if they exist in views, otherwise placeholders
        {
          path: '/create_record',
          name: 'create_record',
          component: () => import('@/views/create_record/index.vue'),
        },
        {
          path: '/decycle',
          name: 'decycle',
          component: () => import('@/views/decycle/index.vue'),
        },
        {
          path: '/draft',
          name: 'draft',
          component: () => import('@/views/draft/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
    },
    {
      path: '/article',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'article',
          component: () => import('@/views/article/ArticleList.vue'),
        },
      ],
    },
    // Catch all 404
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/components/NotFound/index.vue'),
    },
  ],
})

export default router
