<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFollowStore } from '@/stores/follow'
import { showToast } from 'vant'

const router = useRouter()
const followStore = useFollowStore()
const follows = ref([])
const allPosts = ref([])

// 监听 followStore 中的关注列表变化
watch(() => followStore.follows, (newFollows) => {
  follows.value = newFollows.map(follow => ({
    ...follow,
    avatar: follow.avatar || '/src/assets/default-avatar.jpg',
    name: follow.name || '用户名',
    isFollowed: true
  }))
  
  // 更新帖子列表
  updatePosts()
}, { deep: true })

// 更新帖子列表的方法
const updatePosts = async () => {
  try {
    const storedPosts = localStorage.getItem('allPosts')
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts)
      // 确保所有的 userId 都是数字类型，并且过滤掉无效数据
      const normalizedPosts = parsedPosts
        .filter(post => post && post.userId) // 过滤掉无效数据
        .map(post => ({
          ...post,
          userId: Number(post.userId)
        }))
      console.log('获取到的帖子数据:', normalizedPosts)
      allPosts.value = normalizedPosts
    } else {
      // 使用默认的 mockPosts
      const mockPosts = [
        // ... 你的 mockPosts 数据
      ]
      allPosts.value = mockPosts
    }
    
    console.log('当前关注的用户:', follows.value.map(f => Number(f.id)))
  } catch (error) {
    console.error('获取帖子列表失败:', error)
  }
}

// 计算属性：只显示已关注用户的帖子
const followedPosts = computed(() => {
  const followedUserIds = follows.value.map(f => Number(f.id))
  console.log('关注的用户IDs:', followedUserIds)
  
  if (!Array.isArray(allPosts.value)) {
    console.warn('allPosts 不是数组:', allPosts.value)
    return []
  }
  
  const filtered = allPosts.value.filter(post => {
    const postUserId = Number(post.userId)
    console.log(`帖子 ${post.id} 的 userId:${postUserId}, 类型:${typeof postUserId}`)
    const isIncluded = followedUserIds.includes(postUserId)
    console.log(`是否包含:${isIncluded}`)
    return !isNaN(postUserId) && isIncluded
  })
  
  console.log('过滤后的帖子:', filtered)
  return filtered
})

const isLoading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    isLoading.value = true
    await followStore.fetchFollows()
    await updatePosts()
  } catch (error) {
    console.error('初始化数据失败:', error)
    error.value = error
  } finally {
    isLoading.value = false
  }
})

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const handleFollow = async (follow) => {
  try {
    if (follow.isFollowed) {
      await followStore.unfollowUser(follow.id)
      follows.value = follows.value.filter(f => f.id !== follow.id)
      // 更新帖子列表
      updatePosts()
      showToast('已取消关注')
    } else {
      await followStore.followUser(follow.id)
      follow.isFollowed = true
      // 更新帖子列表
      updatePosts()
      showToast('关注成功')
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    showToast('操作失败，请重试')
  }
}

const handlePostClick = (post) => {
  router.push({
    name: 'DynamicDetail',
    params: { 
      id: post.id.toString()
    },
    state: { post }
  })
}
</script>





<template>
  <div class="follow-page">
    <div class="header">
      <div class="title">关注</div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      加载中...
    </div>
    
    <div v-else-if="error" class="error-state">
      加载失败，请重试
    </div>
    
    <div v-else-if="follows.length === 0" class="empty-state">
      暂无关注
    </div>
    
    <template v-else>
      <!-- 关注用户列表 -->
      <div class="follow-users">
        <div 
          v-for="follow in follows" 
          :key="follow.id"
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

      <!-- 添加帖子列表部分 -->
      <div class="posts-container">
        <div v-if="followedPosts.length === 0" class="empty-posts">
          暂无关注用户的帖子
        </div>
        <div v-else class="content-grid">
          <div v-for="post in followedPosts" 
               :key="post.id" 
               class="post-card" 
               @click="handlePostClick(post)">
            <div class="post-image">
              <img :src="post.images[0]" alt="" @error="handleImageError" />
            </div>
            <div class="post-info">
              <div class="post-header">
                <img :src="post.userAvatar" 
                     class="user-avatar" 
                     @error="handleImageError" />
                <span class="username">{{ post.username }}</span>
              </div>
              <p class="post-title">{{ post.title }}</p>
              <div class="post-meta">
                <span class="comment-count">{{ post.commentCount || 0 }} 评论</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
  margin-top: 10px;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.post-info {
  padding: 10px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.post-title {
  font-size: 14px;
  margin: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.empty-posts {
  text-align: center;
  padding: 20px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.error-state {
  text-align: center;
  padding: 40px 0;
  color: #ff4d4f;
}
</style>

