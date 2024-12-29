<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFollowStore } from '../stores/follow'
import { showToast } from 'vant'
import { useLikeStore } from '../stores/like'
import { useCollectionStore } from '../stores/collection'
import { getDynamicDetail } from '@/api/posts'
import { likePost } from '@/api/likes'
import { collectPost, uncollectPost } from '@/api/collection'
import { followUser, unfollowUser, getFollows } from '@/api/follows'

import request from '@/utils/request'

const router = useRouter()
const route = useRoute()
const isFollowing = ref(false)
const commentText = ref('')
const replyTo = ref(null)

// 获取帖子数据
const dynamic = ref({
  images: [], // 初始化空数组
  tags: [],   // 初始化空数组
  comments: [] // 初始化空数组
})

// 模拟数据库中的帖子数据
const mockPosts = [
  {
    id: 1,
    userId: 1,
    username: '动漫迷小杰',
    userAvatar: '/src/assets/avatar1.jpg',
    title: '今天终于收到了期待已久的《鬼灭之刃》..',
    content: '今天终于收到了期待已久的《鬼灭之刃》炭治郎手办，拆开包装的那一刻真是惊艳到了！手办的细节处理得非常到位，从服装的褶皱到武器的质感都栩栩如生。炭治郎的表情也刻画得十分传神，仿佛能感受到他的决心和勇气。这次入������������是太值了！',
    images: ['/src/assets/post1.png'],
    tags: ['手办', '鬼灭之刃', '开箱'],
    commentCount: 23
  },
  {
    id: 2,
    userId: 2,
    username: '手办达人莉莉',
    userAvatar: '/src/assets/avatar2.jpg',
    title: '手办修复记录',
    content: '最近我尝试了一下手办修复，效果非常不错！主要是针对一些年代久远、有些磨损的手办进行了处理。通过打磨、上色等步骤，让这些手办重新焕发出了新的光彩。',
    images: ['/src/assets/post2.png','/src/assets/post2-2.png'],
    tags: ['手办修复', '技术分享'],
    commentCount: 15
  },
  {
    id: 3,
    userId: 3,
    username: '小轩',
    userAvatar: '/src/assets/avatar3.jpg',
    title: '手办摄影作品分享',
    content: '最近参加了一场手办摄影大赛，今天来分享一下我的作品吧！我选择了几个我最喜欢的手办进行拍摄，通过不同的角度和光线来展现它们的美。拍摄过程虽然有些辛苦，但看到成品后觉得一切都值得了。这些照片不仅记录下了手办的美好瞬间，也记录下了我对二次元文化的热爱和执着。',
    images: ['/src/assets/post3.png','/src/assets/post3-2.png','/src/assets/post3-3.png'],
    tags: ['手办摄影', '作品分享'],
    commentCount: 45
  },
  {
    id: 4,
    userId: 4,
    username: '游戏宅小明',
    userAvatar: '/src/assets/avatar4.jpg',
    title: '原神角色展示',
    content: '胡桃太米了，狠狠吃了附属。这款手办完美还原了游戏中的角色形象和魅力，无论是服装还是表情都栩栩如生。手办的质量和细节处理非常出色，让我感受到了制作团队的用心和热情。这次开箱真是让我大饱眼福！',
    images: ['/src/assets/post4.png'],
    tags: ['原神', '胡桃'],
    commentCount: 67
  },
   {
    id: 5,
    userId: 5,
    username: '小雪',
    userAvatar: '/src/assets/avatar4.jpg',
    title: '人活着就是为了初音未来！',
    content: '人活着就是为了初音未来！人活着就是为了���音未来！��活着就是为了初音未来！谁还没有初音妹妹我不说',
    images: ['/src/assets/post5.png'],
    tags: ['初音未来', '手办'],
    commentCount: 67
  }
]

const followStore = useFollowStore()
const likeStore = useLikeStore()
const collectionStore = useCollectionStore()

// 添加收藏状态管理
const isCollected = ref(false)
const collectCount = ref(0)

// 初始化状态
const isLiked = ref(false)
const likeCount = ref(0)

// 更新收藏状态的函数
const updateCollectionState = (postId) => {
  if (!postId) return
  
  // 从 store 获取最新状态
  collectCount.value = collectionStore.getCollectionCount(postId)
  isCollected.value = collectionStore.isPostCollected(postId)

  // 同步更新 dynamic 中的状态
  if (dynamic.value) {
    dynamic.value = {
      ...dynamic.value,
      isCollected: isCollected.value,
      collectCount: collectCount.value
    }
  }
}

onMounted(async () => {
  try {
    const postId = route.params.id
    
    // 从路由状态获取帖子数据
    if (route.state?.post) {
      dynamic.value = route.state.post
      // 确保使用 store 中的最新状态
      likeCount.value = likeStore.getLikeCount(postId)
      isLiked.value = likeStore.isPostLiked(postId)
      collectCount.value = collectionStore.getCollectionCount(postId)
      isCollected.value = collectionStore.isPostCollected(postId)
    } else {
      // 从 mockPosts 获取数据
      const post = mockPosts.find(p => p.id.toString() === postId)
      if (post) {
        dynamic.value = {
          ...post,
          likeCount: likeStore.getLikeCount(post.id),
          isLiked: likeStore.isPostLiked(post.id),
          collectCount: collectionStore.getCollectionCount(post.id),
          isCollected: collectionStore.isPostCollected(post.id)
        }
        // 同步状态
        likeCount.value = likeStore.getLikeCount(post.id)
        isLiked.value = likeStore.isPostLiked(post.id)
        collectCount.value = collectionStore.getCollectionCount(post.id)
        isCollected.value = collectionStore.isPostCollected(post.id)
      }
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
    showToast('加载失败，请重试')
  }
})

// 添加监听器以保持同步
watch(
  () => likeStore.getLikeCount(route.params.id),
  (newCount) => {
    if (dynamic.value?.id) {
      likeCount.value = newCount
    }
  }
)

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    userAvatar: '/src/assets/user1.jpg',
    username: '手办控',
    content: '这个手办真不错！',
    time: '2小时前',
    isLiked: false,
    likeCount: 0
  }
])

// 添加当前显示图片索引
const currentImageIndex = ref(0)

// 切换到上一张图片
const showPrevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// 切换到下一张图片
const showNextImage = () => {
  if (currentImageIndex.value < dynamic.value.images.length - 1) {
    currentImageIndex.value++
  }
}

// 处理关注
const handleFollow = async () => {
  try {
    // 使用 dynamic.value.userid 获取用户ID
    const userId = dynamic.value?.authorid?.userid?.id
    
    if (!userId) {
      console.error('用户ID不存在:', dynamic.value)
      showToast('用户信息不完整')
      return
    }

    if (!isFollowing.value) {
      await followUser(userId)
      isFollowing.value = true
      showToast('关注成功')
    } else {
      await unfollowUser(userId)
      isFollowing.value = false
      showToast('已取消关注')
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    if (error.response?.status === 401) {
      showToast('请先登录')
      router.push('/login')
    } else {
      showToast(error.response?.data?.detail || '操作失败，请重试')
    }
  }
}

// 检查关注状态
const checkFollowStatus = async () => {
  try {
    const userId = dynamic.value?.authorid?.userid?.id
    if (!userId) return

    const response = await getFollows()
    isFollowing.value = response.data.some(follow => follow.followed === userId)
  } catch (error) {
    console.error('获取关注状态失败:', error)
  }
}

// 在获取动态详情后检查关注状态
watch(() => dynamic.value?.authorid?.userid?.id, async (newUserId) => {
  if (newUserId) {
    await checkFollowStatus()
  }
}, { immediate: true })

// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

// 回复评论
const replyComment = (comment) => {
  replyTo.value = comment
  // 聚焦输入框
  const input = document.querySelector('.input-wrapper input')
  if (input) {
    input.focus()
  }
}

// 处理评论点赞
const handleCommentLike = (comment) => {
  comment.isLiked = !comment.isLiked
  comment.likeCount += comment.isLiked ? 1 : -1
}

// 修改提交评论的方法，添加点赞相关属性
const submitComment = async () => {
  if (!commentText.value.trim()) return
  
  try {
    const response = await addComment({
      postId: dynamic.value.id,
      content: commentText.value,
      replyTo: replyTo.value?.id
    })
    
    // 添加新评论到列表
    dynamic.value.comments.push({
      id: response.id,
      userAvatar: response.userAvatar,
      username: response.username,
      content: commentText.value,
      time: '刚刚',
      isLiked: false,
      likeCount: 0
    })
    
    commentText.value = ''
    replyTo.value = null
    dynamic.value.commentCount++
    
    showToast('评论成功')
  } catch (error) {
    console.error('评论失败:', error)
    if (error.response?.status === 401) {
      showToast('请先登录')
      router.push('/login')
    } else {
      showToast(error.response?.data?.detail || '评论失败，请重试')
    }
  }
}

// 更新点赞处理函数
const handleLike = async () => {
  if (!dynamic.value?.id) return
  
  try {
    await likePost(dynamic.value.id)
    dynamic.value.isLiked = !dynamic.value.isLiked
    dynamic.value.likeCount += dynamic.value.isLiked ? 1 : -1
    
    if (dynamic.value.isLiked) {
      likeStore.like(dynamic.value.id)
    } else {
      likeStore.unlike(dynamic.value.id)
    }
    
    showToast(dynamic.value.isLiked ? '点赞成功' : '已取消点赞')
  } catch (error) {
    console.error('点赞操作失败:', error)
    if (error.response?.status === 401) {
      showToast('请先登录')
      router.push('/login')
    } else {
      showToast(error.response?.data?.detail || '操作失败，请重试')
    }
  }
}

// 监听点赞状态变化
watch(
  () => likeStore.getLikeCount(route.params.id),
  (newCount) => {
    if (dynamic.value?.id) {
      likeCount.value = newCount
      isLiked.value = likeStore.isPostLiked(dynamic.value.id)
    }
  }
)

// 修改收藏处理函数
const handleCollect = async () => {
  if (!dynamic.value?.id) return
  
  try {
    if (dynamic.value.isCollected) {
      await uncollectPost(dynamic.value.id)
      dynamic.value.isCollected = false
      dynamic.value.collectCount--
      collectionStore.uncollect(dynamic.value.id)
    } else {
      await collectPost(dynamic.value.id)
      dynamic.value.isCollected = true
      dynamic.value.collectCount++
      collectionStore.collect(dynamic.value.id)
    }
    
    showToast(dynamic.value.isCollected ? '收藏成功' : '已取消收藏')
  } catch (error) {
    console.error('收藏操作失败:', error)
    if (error.response?.status === 401) {
      showToast('请先登录')
      router.push('/login')
    } else {
      showToast(error.response?.data?.detail || '操作失败，请重试')
    }
  }
}

// 添加监听器确保状态同步
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      const currentCollectCount = collectionStore.getCollectionCount(Number(newId)) || 0
      const currentIsCollected = collectionStore.isPostCollected(Number(newId))
      
      collectCount.value = currentCollectCount
      isCollected.value = currentIsCollected
    }
  },
  { immediate: true }
)

// 处理输入框聚焦
const handleInputFocus = () => {
  // 这里可以添加聚焦时的逻辑
}

// 获取动态详情
const fetchDynamicDetail = async () => {
  try {
    const response = await request({
      url: `/acg/post/${route.params.id}/`,
      method: 'get',
      headers: localStorage.getItem('token') ? {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      } : {}  // 未登录时不带 token
    })
    
    // 检查响应数据
    const data = response.data || response
    
    if (!data) {
      throw new Error('未获取到动态数据')
    }
    
    // 根据接口文档处理数据
    dynamic.value = {
      id: data.id,
      userId: data.userid,
      username: data.username,
      nickname: data.nickname,
      userAvatar: data.avatar,
      userDescription: data.description,
      title: data.posttitle,
      content: data.postcontent,
      createdTime: data.postcreated_time,
      // 处理字符串数组
      images: typeof data.postimages === 'string' 
        ? JSON.parse(data.postimages.replace(/'/g, '"')) 
        : data.postimages || [],
      tags: typeof data.posttags === 'string'
        ? JSON.parse(data.posttags.replace(/'/g, '"'))
        : data.posttags || [],
      likeCount: data.like_count || 0,
      collectCount: data.collect_count || 0,
      commentCount: data.comment_count || 0,
      isLiked: data.is_like || false,
      isCollected: data.is_collect || false
    }
    
    // 更新收藏和点赞状态到 store
    if (collectionStore) {
      isCollected.value = dynamic.value.isCollected
      collectCount.value = dynamic.value.collectCount
    }
    
    if (likeStore) {
      isLiked.value = dynamic.value.isLiked
      likeCount.value = dynamic.value.likeCount
    }
    
  } catch (error) {
    console.error('获取动态详情失败:', error)
    showToast('获取详情失败')
  }
}

// 确保在组件挂载时调用
onMounted(() => {
  if (route.params.id) {
    fetchDynamicDetail()
  }
})

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchDynamicDetail()
  }
})
</script>

<template>
  <div class="dynamic-detail" v-if="dynamic">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="user-info">
        <img :src="dynamic.userAvatar" @error="handleAvatarError" class="user-avatar" />
        <span class="username">{{ dynamic.username }}</span>
      </div>
      <div class="action-buttons">
        <button 
          class="follow-btn" 
          :class="{ 'following': isFollowing }"
          @click="handleFollow"
        >
          {{ isFollowing ? '已关注' : '+ 关注' }}
        </button>

      </div>
    </div>

    <!-- 图片展示区 -->
    <div class="image-gallery">
      <div class="arrow left-arrow" @click="showPrevImage" v-if="currentImageIndex > 0">
        ←
      </div>
      <div class="image-wrapper">
        <img :src="dynamic.images[currentImageIndex]" alt="" class="dynamic-image" />
      </div>
      <div class="arrow right-arrow" @click="showNextImage" 
           v-if="currentImageIndex < dynamic.images.length - 1">
        →
      </div>
      <div class="image-indicator">
        {{ currentImageIndex + 1 }}/{{ dynamic.images.length }}
      </div>
    </div>

    <!-- 动态内容 -->
    <div class="dynamic-content">
      <h2 class="dynamic-title">{{ dynamic.title }}</h2>
      <p class="dynamic-text">{{ dynamic.content }}</p>
      <div class="tags">
        <span v-for="tag in dynamic.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 评论区 -->
    <div class="comments-section">
      <h3 class="comments-title">评论 {{ dynamic.commentCount }}</h3>
      <div class="comment-list">
        <div v-for="comment in dynamic.comments" :key="comment.id" class="comment-item">
          <img :src="comment.userAvatar" @error="handleAvatarError" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-user">{{ comment.username }}</div>
            <div class="comment-text">{{ comment.content }}</div>
            <div class="comment-info">
              <span class="comment-time">{{ comment.time }}</span>
              <div class="comment-actions">
                <span class="like-btn" 
                      @click="handleCommentLike(comment)"
                      :class="{ 'liked': comment.isLiked }">
                  <svg class="like-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span class="like-count">{{ comment.likeCount }}</span>
                </span>
                <span class="reply-btn" @click="replyComment(comment)">回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action-bar">
      <div class="input-wrapper">
        <input 
          type="text" 
          v-model="commentText"
          placeholder="说点什么..."
          @focus="handleInputFocus"
          @keyup.enter="submitComment"
        />
      </div>
      <div class="send-btn" v-if="commentText.trim()" @click="submitComment">
        发送
      </div>
      <div class="action-icons">
        <div class="action-item" @click="handleLike">
          <svg class="icon" :class="{ liked: isLiked }" viewBox="0 0 24 24">
            <path v-if="isLiked" 
                  fill="currentColor" 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            <path v-else
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="count" :class="{ liked: isLiked }">{{ likeCount }}</span>
        </div>
        <div class="action-item" @click="handleCollect">
          <svg class="icon" :class="{ collected: isCollected }" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <span class="count" :class="{ collected: isCollected }">{{ collectCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dynamic-detail {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 120px;
  max-width: 640px;
  margin: 0 auto;
}

.nav-bar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 100;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  backdrop-filter: blur(5px);
}

.back-icon {
  font-size: 24px;
  margin-right: 16px;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.follow-btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #FF69B4;
  background-color: #FF69B4;
  color: white;
}

.follow-btn.following {
  background-color: white;
  color: #FF69B4;
}

.follow-btn:hover {
  opacity: 0.8;
}

.follow-btn:active {
  transform: scale(0.95);
}

.image-gallery {
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 1;
  max-height: 640px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dynamic-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  z-index: 10;
}

.left-arrow {
  left: 20px;
}

.right-arrow {
  right: 20px;
}

.image-indicator {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.dynamic-content {
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
}

.dynamic-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.dynamic-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  color: #4CAF50;
  font-size: 14px;
}

.divider {
  height: 8px;
  background: #f5f5f5;
  margin: 16px 0;
}

.comments-section {
  padding: 16px;
  background: #fff;
  margin-bottom: 60px;
}

.comments-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.comment-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.like-btn.liked {
  color: #FF69B4;
}

.like-btn.liked .like-icon {
  animation: pop 0.3s ease;
}

.like-count {
  font-size: 12px;
}

.reply-btn {
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.reply-btn:hover {
  color: #333;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.like-icon {
  transition: all 0.3s ease;
}

.like-btn:hover {
  color: #FF69B4;
}

.like-btn:hover .like-icon {
  transform: scale(1.1);
}

.like-btn:active .like-icon {
  transform: scale(0.95);
}

.comment-input-box {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #eee;
  gap: 12px;
  z-index: 99;
  box-sizing: border-box;
}

.comment-input-box input {
  flex: 1;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #eee;
  border-radius: 18px;
  font-size: 15px;
  outline: none;
}

.comment-input-box input:focus {
  border-color: #FF69B4;
}

.send-btn {
  padding: 6px 12px;
  background-color: #FF69B4;
  color: white;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 16px;
  transition: all 0.3s ease;
}

.send-btn:hover {
  background-color: #FF1493;
}

.send-btn:active {
  transform: scale(0.95);
}

/* 适配不同屏幕尺寸 */
@media screen and (max-width: 375px) {
  .dynamic-content {
    font-size: 14px;
  }
  
  .comment-input-box input {
    font-size: 14px;
  }
}

/* 适配大屏幕 */
@media screen and (min-width: 641px) {
  .dynamic-detail {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
}

/* 适配安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .comment-input-box {
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
  
  .dynamic-detail {
    padding-bottom: calc(120px + env(safe-area-inset-bottom));
  }
}

.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
}

.input-wrapper {
  flex: 1;
  margin-right: 8px;
}

.input-wrapper input {
  width: 100%;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #eee;
  border-radius: 18px;
  font-size: 14px;
  outline: none;
  background: #f5f5f5;
}

.input-wrapper input:focus {
  border-color: #FF69B4;
  background: #fff;
}

.action-icons {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.action-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
  color: #666;
}

/* 未点赞状态下的爱心轮廓 */
.icon:not(.liked) path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

/* 点赞状态下的实心爱心 */
.icon.liked {
  color: #FF69B4;
  animation: heartPop 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.icon.liked path {
  fill: currentColor;
}

/* 点赞数字样式 */
.count.liked {
  color: #FF69B4;
  animation: countPop 0.4s ease;
}

/* 悬浮效果 */
.action-item:hover .icon:not(.liked) {
  color: #FF69B4;
  opacity: 0.7;
}

@keyframes heartPop {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes countPop {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* 点击效果 */
.action-item:active {
  transform: scale(0.95);
}

.action-item:active .icon {
  transform: scale(0.9);
}

.count.collected {
  color: #FFD700;
  animation: countPop 0.4s ease;
}
</style>