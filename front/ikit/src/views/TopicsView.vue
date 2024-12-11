<template>
  <div class="topics-page">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">全部话题</div>
    </div>
    
    <div v-if="topicStore.isLoading" class="loading">
      加载中...
    </div>
    
    <div v-else class="topics-list">
      <div v-for="topic in topics" 
        :key="topic.id"
        class="topic-item"
        @click="handleTopicClick(topic)"
      >
        <div class="topic-title">{{ topic.title }}</div>
        <div class="topic-stats">
          <span>{{ topic.comments }}讨论</span>
          <span>{{ topic.views }}浏览</span>
          <span class="topic-tag">#{{ topic.tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTopicStore } from '@/stores/topics'

const router = useRouter()
const topicStore = useTopicStore()
const topics = ref([])

onMounted(async () => {
  await topicStore.fetchTopics()
  topics.value = topicStore.topics
})

const handleTopicClick = (topic) => {
  router.push({
    path: `/article/detail/${topic.articleId}`
  })
}
</script>

<style scoped>
.topics-page {
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
  padding: 0 15px;
  border-bottom: 1px solid #eee;
}

.back-icon {
  font-size: 18px;
  padding: 10px;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.topics-list {
  padding: 0 15px;
}

.topic-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.topic-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.topic-stats {
  display: flex;
  font-size: 14px;
  color: #666;
  gap: 15px;
}

.topic-tag {
  color: #333;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
