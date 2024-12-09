<template>
  <div class="profile-container">
    <!-- 顶部个人信息 -->
    <div class="profile-header">
      <div class="avatar-section">
        <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
        <div v-else class="avatar-placeholder" @click="chooseAvatar">
          <span class="avatar-icon">👤</span>
        </div>
      </div>
      <div class="username">{{ userInfo.username || 'XXXX' }}</div>
      <div class="settings-icon">⚙️</div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-num">{{ userInfo.collections || '111' }}</div>
        <div class="stat-label">收藏</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ userInfo.followers || '222' }}</div>
        <div class="stat-label">被关注</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ userInfo.following || '333' }}</div>
        <div class="stat-label">关注</div>
      </div>
    </div>

    <!-- 我的动态 -->
    <div class="section">
      <div class="section-header">
        <h2>我的动态</h2>
        <span class="more">more</span>
      </div>
      <div class="date">{{ formatDate(userInfo.lastPostDate) }}</div>
      <div class="post-grid">
        <div v-for="(post, index) in userInfo.recentPosts" :key="index" class="post-item">
          <img :src="post.image" class="post-image" />
          <p class="post-text">{{ post.content }}</p>
          <div class="post-stats">
            <span>❤️ {{ post.likes }}</span>
            <span>⭐ {{ post.stars }}</span>
            <span>💬 {{ post.comments }}w+</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的文章 -->
    <div class="section">
      <div class="section-header">
        <h2>我的文章</h2>
        <span class="more">more</span>
      </div>
      <div class="article-list">
        <div v-for="(article, index) in userInfo.articles" :key="index" class="article-item">
          <h3>{{ article.title }}</h3>
          <p>{{ article.content }}</p>
          <div class="article-images">
            <img v-for="(img, imgIndex) in article.images" 
                 :key="imgIndex" 
                 :src="img" 
                 class="article-image" />
          </div>
          <div class="article-stats">
            <span>❤️ {{ article.likes }}</span>
            <span>⭐ {{ article.stars }}</span>
            <span>💬 {{ article.comments }}w+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

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
  background: #f5f5f5;
  padding: 20px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
}

.avatar-section {
  margin-bottom: 10px;
}

.avatar, .avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.settings-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 24px;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 18px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.section {
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.more {
  color: #666;
  font-size: 14px;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.post-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.article-list {
  margin-top: 10px;
}

.article-item {
  margin-bottom: 20px;
}

.article-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.article-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.post-stats, .article-stats {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}
</style>

