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
      <div v-for="(topic, index) in topics" 
        :key="topic.id"
        class="topic-item"
        @click="handleTopicClick(topic)"
      >
        <div class="topic-main">
          <div class="rank-icon" :class="`rank-${index + 1}`">
            <span class="fire-icon">🔥</span>
            <span class="rank-number">{{ index + 1 }}</span>
          </div>
          <div class="topic-title">{{ topic.title }}</div>
        </div>
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
const topics = ref([
  { 
    id: 1, 
    title: '热门二次元手办收藏指南：哪些角色手办正风靡？',
    comments: 328,
    views: 12800,
    tag: '收藏指南'
  },
  { 
    id: 2, 
    title: '手办模型制作教程：从零开始的创造之旅',
    comments: 256,
    views: 10500,
    tag: '制作教程'
  },
  { 
    id: 3, 
    title: '二次元手办市场趋势：未来热门何在？',
    comments: 198,
    views: 9600,
    tag: '市场趋势'
  },
  {
    id: 4,
    title: '手办与二次元文化：紧密相连的情感纽带',
    comments: 167,
    views: 8900,
    tag: '文化探讨'
  },
  {
    id: 5,
    title: '限量版手办：价值何在？',
    comments: 145,
    views: 7800,
    tag: '收藏价值'
  },
  {
    id: 6,
    title: '手办涂装与保养：让爱永不褪色',
    comments: 134,
    views: 7200,
    tag: '保养技巧'
  },
  {
    id: 7,
    title: '二次元手办在社交媒体：风靡全网的风向标',
    comments: 123,
    views: 6500,
    tag: '社交媒体'
  },
  {
    id: 8,
    title: '手办与动漫、游戏产业：共生共荣的伙伴',
    comments: 112,
    views: 5900,
    tag: '产业联动'
  },
  {
    id: 9,
    title: '二次元手办收藏家的故事：热爱与执着',
    comments: 98,
    views: 5200,
    tag: '收藏故事'
  },
  {
    id: 10,
    title: '手办设计大赛与创意展示：激发无限创意',
    comments: 87,
    views: 4800,
    tag: '创意设计'
  }
])

const handleTopicClick = (topic) => {
  router.push({
    name: 'TopicDetail',
    params: { 
      id: topic.id 
    }
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
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.back-icon {
  font-size: 20px;
  padding: 10px;
  color: #333;
  font-weight:700;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.topics-list {
  padding: 0 15px;
}

.topic-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.topic-main {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.rank-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.fire-icon {
  font-size: 24px;
  line-height: 1;
}

.rank-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #fff;
  font-weight: bold;
}

.topic-title {
  font-size: 16px;
  flex: 1;
}

.topic-stats {
  display: flex;
  font-size: 14px;
  color: #666;
  gap: 15px;
  margin-left: 32px;
}

.topic-tag {
  color: #333;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.rank-1 .fire-icon {
  color: #FF4D4F;
}

.rank-2 .fire-icon {
  color: #FF7A45;
}

.rank-3 .fire-icon {
  color: #FFA940;
}
</style>
