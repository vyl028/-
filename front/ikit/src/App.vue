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
  // 检查路由的 meta 信息
  return !route.meta.hideBottomNav
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
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav" v-if="showBottomNav">
      <router-link to="/home" class="nav-item">
        <span class="icon">🏠</span>
        <span>首页</span>
      </router-link>
      <router-link to="/follow" class="nav-item">
        <span class="icon">🌎</span>
        <span>关注</span>
      </router-link>
      <div class="nav-item" @click="handleCreateClick">
        <div class="post-btn">+</div>
      </div>
      <router-link to="/message" class="nav-item">
        <span class="icon">💬</span>
        <span>消息</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="icon">👤</span>
        <span>我的</span>
      </router-link>
    </div>

    <!-- 创作选项对话框 -->
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
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(238, 238, 238, 0.3);
  max-width: 600px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 12px;
}

.nav-item .icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.post-btn {
  width: 35px;
  height: 35px;
  background: #333;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: -10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.router-link-active {
  color: #000;
  font-weight: 500;
}
</style>