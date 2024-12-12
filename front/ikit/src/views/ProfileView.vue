<template>
  <div class="profile-container">
    <!-- 顶部个人信息 -->
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar-section">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
          <div v-else class="avatar-placeholder">
            <span class="avatar-icon">👤</span>
          </div>
        </div>
        <span class="username">{{ userInfo.username || 'XXXX' }}</span>
        <span class="settings-icon">⚙️</span>
      </div>
      
      <div class="stats-section">
        <div class="stat-item" @click="handleCollectionClick">
          <div class="stat-num">111</div>
          <div class="stat-label">收藏</div>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <div class="stat-num">222</div>
          <div class="stat-label">被关注</div>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <div class="stat-num">333</div>
          <div class="stat-label">关注</div>
        </div>
      </div>
    </div>

    <!-- 我的动态 -->
    <div class="section">
      <div class="section-header">
        <h2>我的动态</h2>
        <span class="more">more</span>
      </div>
      <div class="date">11-21</div>
      <div class="post-content">
        <div class="post-images">
          <div class="image-grid">
            <div class="image-item"></div>
            <div class="image-item"></div>
          </div>
        </div>
        <div class="post-text">
          正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文
        </div>
        <div class="post-stats">
          <span>♥ 1111</span>
          <span>⭐ 666</span>
          <span>💬 1w+</span>
        </div>
      </div>
    </div>

    <!-- 我的文章 -->
    <div class="section">
      <div class="section-header">
        <h2>我的文章</h2>
        <span class="more">more</span>
      </div>
      <div class="article-item">
        <h3 class="article-title">标题标题标题标题标题标题</h3>
        <div class="article-date">11-21</div>
        <div class="article-content">
          正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文
        </div>
        <div class="article-images">
          <div class="image-grid">
            <div class="image-item"></div>
            <div class="image-item"></div>
          </div>
        </div>
        <div class="article-stats">
          <span>♥ 1111</span>
          <span>⭐ 666</span>
          <span>💬 1w+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref({})

const chooseAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await userStore.updateAvatar(file)
        showToast('头像更新成功')
      } catch (error) {
        showToast('头像更新失败')
      }
    }
  }
  input.click()
}

const formatDate = (date) => {
  if (!date) return '11-21'
  return new Date(date).toLocaleDateString()
}

const handleCollectionClick = () => {
  console.log('点击收藏')
  showToast('正在跳转到收藏页面')
  router.push('/collection')
}

onMounted(async () => {
  try {
    userInfo.value = await userStore.getUserInfo()
  } catch (error) {
    showToast('获取用户信息失败')
  }
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 60px;
}

.profile-header {
  padding: 20px 16px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-section {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.avatar, .avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  flex: 1;
  font-size: 18px;
  font-weight: 500;
}

.settings-icon {
  font-size: 20px;
  color: #666;
}

.stats-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-divider {
  color: #ddd;
  margin: 0 20px;
}

.stat-num {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.section {
  padding: 16px;
  border-top: 8px solid #f5f5f5;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h2 {
  font-size: 16px;
  font-weight: 500;
}

.more {
  font-size: 12px;
  color: #666;
}

.date {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.image-item {
  aspect-ratio: 1;
  background: #f5f5f5;
  border-radius: 8px;
}

.post-text, .article-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
}

.post-stats, .article-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.article-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}
</style>

