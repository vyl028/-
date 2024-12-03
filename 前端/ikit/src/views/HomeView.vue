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
  } else {
    router.push('/')
  }
}

// 定义导航项数据
const navItems = [
  { icon: '🏠', text: '推荐' },
  { icon: '📨', text: '名贵' },
  { icon: '📚', text: '问课' },
  { icon: '👥', text: '鬼灭' }
]
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
  
      <!-- 搜索框 -->
      <div class="search-box">
        <i class="search-icon">🔍</i>
        <input type="text" placeholder="请输入您想要搜索的内容">
      </div>
  
      <!-- 功能导航 -->
      <div class="function-nav">
        <div class="nav-item" v-for="(item, index) in navItems" :key="index">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.text }}</span>
        </div>
      </div>
  
      <!-- 内容区域 -->
      <div class="content-grid">
        <div class="content-item" v-for="i in 4" :key="i">
          <div class="content-image"></div>
          <div class="content-info">
            <h3>XX手办分享</h3>
            <p>XX手办开箱...</p>
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
  margin-bottom: 20px;
  padding: 0 16px;
}

.search-box input {
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #eee;
  background: #f5f5f5;
}

.search-icon {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
}

.function-nav {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-icon {
  font-size: 24px;
}

.nav-text {
  font-size: 12px;
  color: #333;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
  margin-bottom: 60px;
}

.content-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.content-image {
  width: 100%;
  padding-top: 100%;
  background: #f5f5f5;
}

.content-info {
  padding: 8px;
}

.content-info h3 {
  font-size: 14px;
  margin-bottom: 4px;
}

.content-info p {
  font-size: 12px;
  color: #999;
}
</style>