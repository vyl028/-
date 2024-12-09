<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()

// 静态详情数据
const activity = ref({
  id: 1,
  title: '北京CCW华彩国际动漫游戏展',
  image: '/src/assets/article-image.jpg',
  startDate: '1月1日',
  endDate: '1月3日',
  description: '这是一个精彩的动漫展览，将展出众多精美的手办、动漫周边等。现场还有cosplay表演和互动环节，欢迎各位动漫爱好者参加！',
  // 添加相关文章数据
  relatedArticles: [
    {
      id: 1,
      title: 'CCW展会精彩回顾',
      cover: '/src/assets/article1.jpg',
      summary: '本次CCW展会汇集了众多精彩展品，让我们一起回顾展会亮点...',
      author: '动漫达人',
      views: 1234
    },
    {
      id: 2, 
      title: '漫展cos精选图集',
      cover: '/src/assets/article2.jpg',
      summary: '现场cos表演精彩纷呈，各路coser带来了精彩的演绎...',
      author: 'Cos爱好者',
      views: 2345
    }
  ]
})

// 添加跳转到文章详情的方法
const goToArticle = (articleId) => {
  router.push(`/article/detail/${articleId}`)
}
</script>

<template>
  <div class="activity-detail">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">活动详情</div>
    </div>

    <div class="content" v-if="activity">
      <img :src="activity.image" class="cover-image" />
      <div class="info-section">
        <h1>{{ activity.title }}</h1>
        <div class="time">
          活动时间：{{ activity.startDate }}-{{ activity.endDate }}
        </div>
        <div class="description">
          {{ activity.description }}
        </div>
      </div>
    </div>

    <!-- 添加相关文章部分 -->
    <div class="related-articles">
      <div class="section-title">相关文章</div>
      <div class="article-list">
        <div 
          v-for="article in activity.relatedArticles" 
          :key="article.id"
          class="article-item"
          @click="goToArticle(article.id)"
        >
          <img :src="article.cover" class="article-cover" />
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="author">{{ article.author }}</span>
              <span class="views">{{ article.views }} 阅读</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-detail {
  min-height: 100vh;
  background: #f5f5f5;
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
  padding: 0 15px;
  z-index: 100;
}

.back-icon {
  font-size: 24px;
  padding: 5px 10px;
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.content {
  background: #fff;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.info-section {
  padding: 15px;
}

.info-section h1 {
  font-size: 20px;
  margin-bottom: 10px;
}

.time {
  color: #666;
  margin-bottom: 15px;
}

.description {
  line-height: 1.6;
  color: #333;
}

.related-articles {
  margin-top: 20px;
  padding: 15px;
  background: #fff;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #333;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.article-cover {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.author {
  color: #666;
}
</style> 