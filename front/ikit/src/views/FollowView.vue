<template>
  <div class="follow-page">
    <div class="header">
      <div class="title">关注</div>
    </div>
    
    <!-- 关注用户列表 -->
    <div class="follow-users">
      <div 
        v-for="(follow, index) in follows" 
        :key="index"
        class="follow-user-item"
      >
        <img :src="follow.avatar" class="user-avatar" @error="handleImageError" />
        <div class="user-name">{{ follow.name }}</div>
        <div 
          class="follow-button"
          :class="{ 'followed': follow.isFollowed }"
          @click="handleFollow(follow)"
        >
          {{ follow.isFollowed ? '已关注' : '关注' }}
        </div>
      </div>
    </div>

    <!-- 关注内容列表 -->
    <div class="content-grid">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="post-card"
        @click="handlePostClick(post.id)"
      >
        <div class="post-image">
          <img :src="post.coverImage" alt="" @error="handleImageError" />
        </div>
        <div class="post-info">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-summary">{{ post.summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.follow-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.follow-users {
  background: #fff;
  padding: 15px;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  border-bottom: 1px solid #eee;
}

.follow-user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  min-width: 80px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-bottom: 8px;
}

.user-name {
  font-size: 12px;
  color: #333;
  margin-bottom: 4px;
}

.follow-button {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  background: #f5f5f5;
  color: #666;
}

.follow-button.followed {
  background: #eee;
}

.content-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
}

.post-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  padding: 8px;
}

.post-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.post-summary {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFollowStore } from '@/stores/follow'
import { showToast } from 'vant'

const router = useRouter()
const followStore = useFollowStore()
const follows = ref([])
const posts = ref([])

onMounted(async () => {
  // 获取关注用户列表
  await followStore.fetchFollows()
  follows.value = followStore.follows

  // 获取关注用户的文章列表
  posts.value = [
    {
      id: 1,
      title: 'XX手办分享',
      summary: 'XX手办开箱...',
      coverImage: '/src/assets/post1.jpg'
    },
    {
      id: 2,
      title: 'Cos照片分享',
      summary: '最新cos照片...',
      coverImage: '/src/assets/post2.jpg'
    },
    // 更多文章...
  ]
})

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const handleFollow = async (follow) => {
  try {
    if (follow.isFollowed) {
      await followStore.unfollowUser(follow.id)
      follow.isFollowed = false
      showToast('已取消关注')
    } else {
      await followStore.followUser(follow.id)
      follow.isFollowed = true
      showToast('关注成功')
    }
  } catch (error) {
    showToast('操作失败，请重试')
  }
}

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}
</script>

