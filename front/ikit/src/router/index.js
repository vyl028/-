import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user'  // 暂时注释掉
// import { showToast } from 'vant'  // 暂时注释掉
import CollectionView from '@/views/CollectionView.vue'

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
      name: 'articleDetail',
      component: () => import('../views/ArticleDetailView.vue')
    },
    {
      path: '/follow',
      name: 'follow',
      component: () => import('../views/FollowView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/topics',
      name: 'topics',
      component: () => import('../views/TopicsView.vue')
    },
    {
      path: '/topic/detail/:id',
      name: 'topicDetail',
      component: () => import('../views/TopicDetailView.vue')
    },
    {
      path: '/article/edit',
      name: 'ArticleEdit',
      component: () => import('@/views/ArticleEditView.vue')
    },
    {
      path: '/post/edit',
      name: 'PostEdit',
      component: () => import('@/views/PostEditView.vue')
    },
    {
      path: '/collection',
      name: 'Collection',
      component: CollectionView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 暂时注释掉登录验证逻辑
  // const userStore = useUserStore()
  // if (to.meta.requiresAuth && !userStore.isLoggedIn) {
  //   showToast('请先登录')
  //   next('/login')
  //   return
  // }
  next()
})

export default router