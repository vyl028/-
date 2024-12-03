<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <!-- 页面主体内容 -->
    <RouterView />

    <!-- 底部导航栏 -->
        <div class="bottom-nav">
      <router-link to="/" class="nav-item">
        <span class="icon">🏠</span>
        <span>首页</span>
      </router-link>
      <router-link to="/discover" class="nav-item">
        <span class="icon">🔍</span>
        <span>发现</span>
      </router-link>
      <router-link to="/post" class="nav-item">
        <span class="icon">✏️</span>
        <span>发帖</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="icon">👤</span>
        <span>我的</span>
      </router-link>
    </div>
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
  padding-bottom: 60px; /* 为底部导航留出空间 */
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  height: 50px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.1);
}

.nav-item {
  text-decoration: none;
  color: #333;
}

.nav-item.router-link-active {
  color: #007AFF;
}
</style>