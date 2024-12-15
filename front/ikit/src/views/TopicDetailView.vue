<template>
  <div class="topic-detail">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">话题</div>
      <div class="right-placeholder"></div>
    </div>

    <div class="topic-content" v-if="topic">
      <h1 class="topic-title">{{ topic.title }}</h1>
      <p class="topic-desc">{{ topic.description }}</p>
      
      <div class="topic-tags">
        <span class="tag" v-for="tag in topic.tags" :key="tag">#{{ tag }}</span>
      </div>

      <div class="posts-section">
        <div class="section-title">动态 {{ topic.postCount || 16 }}</div>
        
        <div class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <div class="user-info">
              <img :src="post.avatar" class="avatar" @error="handleImageError"/>
              <span class="username">{{ post.username }}</span>
              <button class="follow-btn" v-if="!post.isFollowing">关注</button>
            </div>
            
            <div class="post-content">
              <p class="text">{{ post.content }}</p>
              <div class="image-grid" v-if="post.images && post.images.length">
                <img 
                  v-for="img in post.images" 
                  :key="img"
                  :src="img"
                  class="post-image"
                  @error="handleImageError"
                />
              </div>
            </div>

            <div class="post-actions">
              <div class="action-item">
                <span class="icon">♡</span>
                <span class="count">{{ post.likes || 10 }}</span>
              </div>
              <div class="action-item">
                <span class="icon">💬</span>
                <span class="count">{{ post.comments || 20 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="write-btn" @click="router.push('/article/edit')">
      <svg class="write-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.topic-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
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
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.back-icon {
  font-size: 20px;
  padding: 10px;
  color: #333;
  font-weight: 700;
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.right-placeholder {
  width: 40px;
}

.topic-content {
  padding: 60px 16px 16px;
}

.topic-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.topic-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
}

.posts-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.post-item {
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.username {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.follow-btn {
  padding: 4px 12px;
  border: 1px solid #ff4d4d;
  border-radius: 16px;
  color: #ff4d4d;
  background: transparent;
  font-size: 12px;
}

.post-content {
  margin-bottom: 12px;
}

.text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.post-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}

.post-actions {
  display: flex;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.write-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4d 100%);
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 99;
}

.write-icon {
  color: white;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 话题数据映射
const topicDataMap = {
  1: {
    title: '热门二次元手办收藏指南：哪些角色手办正风靡？',
    description: '一起来聊聊当下最热门的手办收藏话题，分享你的收藏故事！',
    tags: ['收藏指南', '手办', '二次元'],
    postCount: 328
  },
  2: {
    title: '手办模型制作教程：从零开始的创造之旅',
    description: '想要自己动手制作手办吗？这里有最全面的入门指南。',
    tags: ['制作教程', 'DIY', '手办'],
    postCount: 256
  },
  3: {
    title: '二次元手办市场趋势：未来热门何在？',
    description: '探讨手办市场的发展趋势，预测下一个爆款。',
    tags: ['市场趋势', '手办', '收藏价值'],
    postCount: 198
  }
  // ... 可以继续添加其他话题的数据
}

// 根据路由参数获取话题数据
const topic = ref(null)
const posts = ref([])

onMounted(() => {
  const topicId = parseInt(route.params.id)
  topic.value = topicDataMap[topicId] || {
    title: '话题加载中...',
    description: '正在获取话题信息',
    tags: [],
    postCount: 0
  }
  
  // 根据话题ID加载对应的帖子数据
  posts.value = [
    {
      id: 1,
      username: '收藏达人',
      avatar: '/default-avatar.jpg',
      content: topicId === 1 ? '最近入手了限定版明日香手办，质感非常棒！' :
               topicId === 2 ? '分享一下我的第一个手工手办制作经验' :
               '来聊聊最近市场上的新品',
      images: ['/post-image-1.jpg'],
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      isFollowing: false
    },
    {
      id: 2,
      username: '二次元控',
      avatar: '/default-avatar.jpg',
      content: topicId === 1 ? '推荐几个值得收藏的系列' :
               topicId === 2 ? '制作过程中要注意的细节' :
               '分析一下近期市场走向',
      images: ['/post-image-2.jpg'],
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      isFollowing: false
    }
  ]
})

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}
</script>
