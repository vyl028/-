<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('discover')

// 处理标签页切换
const handleTabChange = (tab) => {
  activeTab.value = tab
  if (tab === 'plaza') {
    router.push('/plaza')
  } else if (tab === 'discover') {
    router.push('/discover')  
  }
}

// 定义导航项数据
const navItems = [
  { icon: '🏠', text: '首页', path: '/home' },
  { icon: '🌎', text: '关注', path: '/plaza' },
  { icon: '💬', text: '消息', path: '/message' },
  { icon: '👤', text: '我的', path: '/profile' }
]

// 添加导航方法
const handleNavigation = (path) => {
  router.push(path)
}

const handleArticleClick = (articleId) => {
  router.push({
    name: 'ArticleDetail',
    params: { id: articleId }
  })
}

// 添加帖子数据
const posts = ref([
  {
    id: 1,
    title: 'XX手办分享',
    summary: 'XX手办开箱...',
    coverImage: '/src/assets/post1.jpg'
  },
  {
    id: 2,
    title: 'XX手办分享',
    summary: 'XX手办开箱...',
    coverImage: '/src/assets/post2.jpg'
  },
  {
    id: 3,
    title: 'XX手办分享',
    summary: 'XX手办开箱...',
    coverImage: '/src/assets/post3.jpg'
  },
  {
    id: 4,
    title: 'XX手办分享',
    summary: 'XX手办开箱...',
    coverImage: '/src/assets/post4.jpg'
  }
])

// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

// 处理帖子点击
const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}
</script>

<template>
    <div class="home-page">
      <!-- 顶部标签页 -->
      <div class="tabs">
        <div 
          :class="['tab', activeTab === 'discover' ? 'active' : '']"
          @click="handleTabChange('discover')"
        >发现</div>
        <div 
          :class="['tab', activeTab === 'plaza' ? 'active' : '']"
          @click="handleTabChange('plaza')"
        >广场</div>
      </div>
  
      <!-- 搜索框 - 移除搜索图标 -->
      <div class="search-box">
        <input type="text" placeholder="请输入您想要搜索的内容">
      </div>
  
      <!-- 功能导航 -->
      <div class="function-nav">
        <div class="nav-item" v-for="(item, index) in navItems" :key="index" @click="handleNavigation(item.path)">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.text }}</span>
        </div>
      </div>
  
      <!-- 内容区域 -->
      <div class="content-grid">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="post-card"
          @click="handlePostClick(post.id)"
        >
          <div class="post-image">
            <img :src="post.coverImage" alt="" />
          </div>
          <div class="post-info">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-summary">{{ post.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #fff;
}

.tabs {
  position: sticky;
  top: 0;
  display: flex;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #999;
  padding: 8px 0;
}

.tab.active {
  color: #333;
  font-weight: bold;
}

.search-box {
  margin: 10px 15px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 15px;
}

.search-box input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.function-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 15px;
  gap: 10px;
  background: #fff;
  margin-bottom: 15px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.nav-text {
  font-size: 12px;
  color: #666;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.post-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

.post-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  padding: 8px;
}

.post-title {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  font-weight: normal;
}

.post-summary {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0;
  line-height: 1.4;
}
</style>