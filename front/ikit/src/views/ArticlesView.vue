<template>
  <div class="articles-page">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">我的文章</div>
    </div>

    <div class="articles-list">
      <div v-for="article in articles" 
        :key="article.id" 
        class="article-item"
        @click="handleArticleClick(article.id)"
      >
        <div class="article-info">
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="article-meta">
            <span class="date">{{ article.date }}</span>
            <span class="views">{{ article.views }} 阅读</span>
          </div>
          <p class="article-summary">{{ article.summary }}</p>
        </div>
        <div class="article-cover" v-if="article.coverImage">
          <img :src="article.coverImage" @error="handleImageError" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { showToast } from 'vant'

const router = useRouter()
const articleStore = useArticleStore()
const articles = ref([])

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const handleArticleClick = (articleId) => {
  router.push(`/article/detail/${articleId}`)
}

onMounted(async () => {
  try {
    await articleStore.fetchUserArticles()
    articles.value = articleStore.userArticles
  } catch (error) {
    showToast('获取文章列表失败')
  }
})
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  background: #fff;
  padding-top: 44px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  z-index: 100;
}

.back-icon {
  font-size: 18px;
  padding: 8px;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.articles-list {
  padding: 16px;
}

.article-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.article-info {
  flex: 1;
  margin-right: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.article-meta {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.article-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.article-cover {
  width: 120px;
  height: 80px;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
</style> 