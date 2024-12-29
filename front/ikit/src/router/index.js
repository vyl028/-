import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user'  // 暂时注释掉
// import { showToast } from 'vant'  // 暂时注释掉
import CollectionView from '@/views/CollectionView.vue'
import { useFollowStore } from '@/stores/follow'
import HomeView from '../views/HomeView.vue'

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

    },
    {
      path: '/plaza',
      name: 'plaza',
      component: () => import('../views/PlazaView.vue'),

    },
    // 首页分类的跳转：原神、等等
    {
      path: '/discover',
      redirect: '/home'  // 重定向到 home
    },
    {
      path: '/discover/yuanshen',
      name: 'yuanshen',
      component: () => import('../views/HomeView.vue'),

    },
    {
      path: '/discover/chuyin',
      name: 'chuyin',
      component: () => import('../views/HomeView.vue'),

    },
    {
      path: '/discover/kimetsu',
      name: 'kimetsu',
      component: () => import('../views/HomeView.vue'),

    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('../views/ActivityView.vue'),

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
      path: '/article/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/ArticleDetailView.vue'),
      props: true
    },
    {
      path: '/follow',
      name: 'follow',
      component: () => import('../views/FollowView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/topics',
      name: 'Topics',
      component: () => import('@/views/TopicsView.vue')
    },
    {
      path: '/topic/detail/:id',
      name: 'TopicDetail',
      component: () => import('@/views/TopicDetailView.vue')
    },
    {
      path: '/article/edit',
      name: 'ArticleEdit',
      component: () => import('@/views/ArticleEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/post/edit',
      name: 'PostEdit',
      component: () => import('@/views/PostEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'DynamicDetail',
      component: () => import('@/views/DynamicDetailView.vue'),
      meta: { hideBottomNav: true }
    },
    {
      path: '/collection',
      name: 'Collection',
      component: CollectionView,
      meta: { requiresAuth: true, hideBottomNav: true }
    },
    {
      path: '/fans',
      name: 'Fans',
      component: () => import('@/views/FansView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/articles',
      name: 'Articles',
      component: () => import('@/views/ArticlesView.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../views/SearchResultView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next();
})

router.afterEach(() => {
  const followStore = useFollowStore();
  localStorage.setItem('followedUsers', JSON.stringify(followStore.followedUsers.value));
})

export default router