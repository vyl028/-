<template>
  <div class="topic-detail">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">{{ topic?.title || 'XX话题' }}</div>
    </div>

    <div class="topic-content" v-if="topic">
      <h1 class="main-title">{{ topic.title }}</h1>
      
      <div class="tab-section">
        <div class="tab active">动态</div>
      </div>

      <div class="posts">
        <div v-for="post in topicPosts" 
          :key="post.id"
          class="post-item"
        >
          <div class="user-info">
            <img :src="post.avatar" class="user-avatar" @error="handleImageError" />
            <span class="username">{{ post.username }}</span>
          </div>
          
          <div class="post-content">
            <p class="text">{{ post.content }}</p>
            <img v-if="post.image" :src="post.image" class="post-image" @error="handleImageError" />
          </div>

          <div class="post-actions">
            <div class="action-button" @click="goToArticle(post.articleId)">
              前往 →
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTopicStore } from '@/stores/topics'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const topicStore = useTopicStore()
const topic = ref(null)
const topicPosts = ref([])

onMounted(async () => {
  try {
    const { currentTopic, topicPosts: posts } = await topicStore.fetchTopicDetail(route.params.id)
    if (!currentTopic) {
      showToast('话题不存在')
      router.back()
      return
    }
    topic.value = currentTopic
    topicPosts.value = posts
  } catch (error) {
    console.error('获取话题详情失败:', error)
    showToast('获取话题详情失败')
    router.back()
  }
})

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const goToArticle = (articleId) => {
  router.push(`/article/detail/${articleId}`)
}
</script>

<style scoped>
.topic-detail {
  min-height: 100vh;
  background: #fff;
}

.header {
  height: 44px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 15px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-icon {
  font-size: 18px;
  padding: 10px;
}

.main-title {
  font-size: 18px;
  padding: 15px;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.tab-section {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.tab {
  display: inline-block;
  padding: 5px 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.post-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.post-content {
  margin: 10px 0;
}

.post-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.action-button {
  padding: 5px 10px;
  color: #666;
  cursor: pointer;
}
</style>
