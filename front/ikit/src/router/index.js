import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plaza',
      name: 'plaza',
      component: () => import('../views/PlazaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/discover',
      redirect: '/home'  // 同样重定向到 discover
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('../views/ActivityView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('../views/MessageView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/activity/detail/:id',
      name: 'activityDetail',
      component: () => import('../views/ActivityDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('../views/PostView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/article/detail/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/ArticleDetailView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router