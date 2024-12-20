<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import CreateOptionsDialog from '@/views/CreateOptionsDialog.vue'

const userStore = useUserStore()
const route = useRoute()
const showCreateOptions = ref(false)

// 控制底部导航栏显示
const showBottomNav = computed(() => {
  return !route.meta.hideBottomNav
})

// 添加 currentRoute 计算属性
const currentRoute = computed(() => {
  const path = route.path
  // 如果路径包含 discover 或其子路由，仍然返回 home
  if (path === '/home' || path.includes('/discover')) {
    return 'home'
  }
  return path.split('/')[1] || 'home'
})

const handleCreateClick = () => {
  showCreateOptions.value = true
}

const handleCreateOptionsClose = () => {
  showCreateOptions.value = false
}

const handleCreateOptionSelect = (type) => {
  console.log('Selected option:', type)
}
</script>

<template>
  <div class="app">
    <RouterView />
    
    <div class="bottom-nav" v-if="showBottomNav">
      <router-link to="/home" class="nav-item" :class="{ 'active': currentRoute === 'home' }">
        <img src="@/assets/logo/home.svg" alt="首页" class="icon" />
        <span>首页</span>
      </router-link>
      <router-link to="/follow" class="nav-item" :class="{ 'active': currentRoute === 'follow' }">
        <img src="@/assets/logo/slack.svg" alt="关注" class="icon" />
        <span>关注</span>
      </router-link>
      <div class="nav-item create-btn" @click="handleCreateClick">
        <div class="post-btn"></div>
      </div>
      <router-link to="/message" class="nav-item" :class="{ 'active': currentRoute === 'message' }">
        <img src="@/assets/logo/mail.svg" alt="消息" class="icon" />
        <span>消息</span>
      </router-link>
      <router-link to="/profile" class="nav-item" :class="{ 'active': currentRoute === 'profile' }">
        <img src="@/assets/logo/user.svg" alt="我的" class="icon" />
        <span>我的</span>
      </router-link>
    </div>

    <CreateOptionsDialog 
      :show="showCreateOptions" 
      @close="handleCreateOptionsClose"
      @select="handleCreateOptionSelect" 
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  padding-bottom: 60px;
  position: relative;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  height: 60px;
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #808080;
  font-size: 12px;
  transition: all 0.3s ease;
  padding: 4px 12px;
  flex: 1;
  justify-content: center;
}

.nav-item .icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.nav-item span {
  transition: all 0.3s ease;
}

/* 激活状态样式 */
.nav-item.active {
  color: #FF69B4;
}

.nav-item.active .icon {
  transform: scale(1.1);
  filter: invert(73%) sepia(41%) saturate(5829%) hue-rotate(308deg) brightness(101%) contrast(101%);
}

/* 修改创建按钮样式 */
.create-btn {
  transform: translateY(-3px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-btn {
  width: 38px;
  height: 38px;
  background: #FF69B4;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.);
  position: relative;
  transition: all 0.3s ease;
}

/* 创建白色加号 */
.post-btn::before,
.post-btn::after {
  content: '';
  position: absolute;
  background-color: #FFFFFF !important; /* 强制使用白色 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.post-btn::before {
  border-radius: 1px;
  width: 3px;
  height: 16px;
}

.post-btn::after {
  border-radius: 2px;
  width: 16px;
  height: 3px;
}

/* 悬停效果 */
.create-btn:hover .post-btn {
  transform: rotate(45deg);
}

@media screen and (min-width: 600px) {
  .bottom-nav {
    left: 50%;
    transform: translateX(-50%);
    max-width: 600px;
  }
}
</style>
