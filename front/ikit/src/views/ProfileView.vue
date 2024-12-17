<template>
  <div class="profile-container">
    <!-- 顶部个人信息 -->
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar-section">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" @click="chooseAvatar" />
          <div v-else class="avatar-placeholder" @click="chooseAvatar">
            <img src="@/assets/user/anon.jfif" alt="默认头像" class="default-avatar" />
          </div>
        </div>
        <span class="username">{{ userInfo.username || '千早爱音' }}</span>
        <span class="settings-icon">⚙️</span>
      </div>

      <div class="stats-section">
        <div class="stat-item" @click="handleCollectionClick">
          <div class="stat-num">116</div>
          <div class="stat-label">收藏</div>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item" @click="handleFansClick">
          <div class="stat-num">22W</div>
          <div class="stat-label">被关注</div>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item" @click="handleFollowClick">
          <div class="stat-num">261</div>
          <div class="stat-label">关注</div>
        </div>
      </div>
    </div>

    <!-- 我的动态 -->
    <div class="section">
      <div class="section-header">
        <h2>我的动态</h2>
        <span class="more" @click="handleMorePosts">more</span>
      </div>
      <div class="post-content" @click="handlePostClick">
        <div class="date">11-21</div>
        <div class="post-images">
          <div class="image-grid">
            <div class="image-item">
              <img src="@/assets/user/dontai2.jpg" alt="动态图片1" />
            </div>
            <div class="image-item">
              <img src="@/assets/user/dontai1.jpg" alt="动态图片2" />
            </div>
          </div>
        </div>
        <div class="post-text">
          含税售价：［PACK］1,100日元 /［BOX］ 6,600日元
          尺寸：高度约90cm
          规格：盲盒
          种类数：通常版共5种，秘密版共6种（包括珍珠版本5种和超稀有1种）。每个BOX里有来自通常版（共5种）和秘密版（共6种）中的一种。
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
        <span class="more" @click="handleMoreArticles">more</span>
      </div>
      <div class="article-item" v-for="article in userArticles" :key="article.id"
        @click="handleArticleClick(article.id)">
        <h3 class="article-title">{{ article.title }}</h3>
        <div class="article-date">{{ article.date }}</div>
        <div class="article-content">
          {{ article.summary }}
        </div>
        <div class="article-images">
          <div class="image-grid">
            <div class="image-item" v-for="(image, index) in article.images" :key="index">
              <img :src="image" :alt="`文章图片${index + 1}`" />
            </div>
          </div>
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
import { useArticleStore } from '@/stores/article'
import article1 from '@/assets/user/article1.jpg'
import article2 from '@/assets/user/article2.jpg'

const router = useRouter()
const userStore = useUserStore()
const articleStore = useArticleStore()
const userInfo = ref({})
const userArticles = ref([
  {
    id: 1,
    title: '爱音的手办，不知道有没有搬运',
    date: '11-21',
    summary: '如果有人搬了就给还没看到的看一下,还有灯灯的，唉，魅魔。这是GK，要自己涂装的，还可以等官方出成品。',
    images: [article1, article2]
  }
])

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

const handleFansClick = () => {
  console.log('点击被关注')
  showToast('正在跳转到粉丝页面')
  router.push('/fans')
}

const handleFollowClick = () => {
  console.log('点击关注')
  showToast('正在跳转到关注页面')
  router.push('/follow')
}

const handlePostClick = () => {
  router.push(`/topic/detail/1`)
}

const handleArticleClick = async (articleId) => {
  try {
    console.log('点击文章:', articleId)
    await articleStore.fetchArticleDetail(articleId)
    router.push(`/article/detail/${articleId || 1}`)
  } catch (error) {
    showToast('获取文章详情失败')
  }
}

const handleMorePosts = () => {
  router.push('/topics')
}

const handleMoreArticles = () => {
  router.push('/articles')
}

onMounted(async () => {
  try {
    userInfo.value = await userStore.getUserInfo()
    // 先设置一个默认文章，避免空白
    userArticles.value = [
      {
        id: 1,
        title: '标题标题标题标题标题标题',
        date: '11-21',
        summary: '正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文',
        images: ['/src/assets/article1.jpg', '/src/assets/article2.jpg']
      }
    ]
    // 然后获取实际文章列表
    await articleStore.fetchUserArticles()
    if (articleStore.userArticles.length > 0) {
      userArticles.value = articleStore.userArticles
    }
  } catch (error) {
    showToast('获取信息失败')
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

.avatar,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* 确保图片不会超出圆形边界 */
}

.avatar img,
.default-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片合适地填充容器 */
}

.avatar,
.avatar-placeholder {
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
  padding: 20px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 500;
}

.more {
  color: #666;
  font-size: 14px;
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
  border-radius: 8px;
  overflow: hidden;
  /* 确保图片不会超出圆角边界 */
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片填充整个容器并保持比例 */
}

.article-images {
  margin-top: 12px;
}

.post-text,
.article-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
}

.post-stats,
.article-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.article-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.article-content {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.image-item {
  aspect-ratio: 1;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
