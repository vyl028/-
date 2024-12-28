<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFollowStore } from '../stores/follow'
import { showToast } from 'vant'
import { useLikeStore } from '../stores/like'
import { useCollectionStore } from '../stores/collection'

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
  if (!dynamic.value?.userId) return
  
  try {
    if (isFollowing.value) {
      await followStore.unfollowUser(dynamic.value.userId)
      isFollowing.value = false
    } else {
      // 保存完整的用户信息
      const userInfo = {
        id: dynamic.value.userId,
        name: dynamic.value.username,
        avatar: dynamic.value.userAvatar
      }
      await followStore.followUser(dynamic.value.userId, userInfo)
      isFollowing.value = true
    }
    
    // 更新 localStorage 中的关注状态
    const followingUsers = JSON.parse(localStorage.getItem('followingUsers') || '[]')
    if (isFollowing.value) {
      // 添加关注
      if (!followingUsers.some(user => user.id === dynamic.value.userId)) {
        followingUsers.push({
          id: dynamic.value.userId,
          name: dynamic.value.username,
          avatar: dynamic.value.userAvatar
        })
      }
    } else {
      // 取消关注
      const index = followingUsers.findIndex(user => user.id === dynamic.value.userId)
      if (index > -1) {
        followingUsers.splice(index, 1)
      }
    }
    localStorage.setItem('followingUsers', JSON.stringify(followingUsers))
    
    showToast(isFollowing.value ? '关注成功' : '已取消关注')
  } catch (error) {
    console.error('关注操作失败:', error)
    showToast('操作失败，请重试')
  }
}

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
const submitComment = () => {
  if (!commentText.value.trim()) return
  
  comments.value.push({
    id: comments.value.length + 1,
    userAvatar: '/src/assets/default-avatar.jpg',
    username: '当前用户',
    content: commentText.value,
    time: '刚刚',
    isLiked: false,
    likeCount: 0
  })
  
  commentText.value = ''
  replyTo.value = null
}

// 更新点赞处理函数
const handleLike = async () => {
  if (!dynamic.value?.id) return
  
  try {
    const newState = likeStore.toggleLike(dynamic.value.id)
    isLiked.value = newState
    likeCount.value = likeStore.getLikeCount(dynamic.value.id)
    
    // 更新 dynamic 中的状态
    dynamic.value = {
      ...dynamic.value,
      isLiked: newState,
      likeCount: likeCount.value
    }
    
    showToast(newState ? '点赞成功' : '已取消点赞')
  } catch (error) {
    console.error('点赞操作失败:', error)
    showToast('操作失败，请重试')
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
const handleCollect = () => {
  if (!dynamic.value?.id) return
  
  try {
    // 保存完整的帖子信息
    const postData = {
      id: dynamic.value.id,
      title: dynamic.value.title,
      content: dynamic.value.content,
      username: dynamic.value.username,
      userAvatar: dynamic.value.userAvatar,
      images: dynamic.value.images,
      tags: dynamic.value.tags || [],
      date: new Date().toLocaleDateString(), // 添加收藏日期
      author: dynamic.value.username // 确保作者信息存在
    }

    // 切换收藏状态
    const newState = collectionStore.toggleCollection(postData)

    // 更新状态
    isCollected.value = newState
    collectCount.value = collectionStore.getCollectionCount(dynamic.value.id)

    // 同步更新 dynamic 中的状态
    dynamic.value = {
      ...dynamic.value,
      isCollected: newState,
      collectCount: collectCount.value
    }

    // 显示提示
    showToast(newState ? '收藏成功' : '已取消收藏')
  } catch (error) {
    console.error('收藏操作失败:', error)
    showToast('操作失败，请重试')
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

// 在获取动态详情时初始化收藏数
const fetchDynamicDetail = async () => {
  try {
    const response = await getDynamicDetail(route.params.id)
    dynamic.value = response
    // 从 likeStore 获取点赞状态和数量
    isLiked.value = likeStore.isPostLiked(response.id)
    likeCount.value = likeStore.getLikeCount(response.id)
    // ... 其他初始化代码
  } catch (error) {
    console.error('获取动态详情失败:', error)
    showToast('获取详情失败')
  }
}

// 监听点赞状态变化
watch(() => likeStore.getLikeCount(route.params.id), (newCount) => {
  if (dynamic.value?.id) {
    likeCount.value = newCount
    // 同时更新点赞状态
    isLiked.value = likeStore.isPostLiked(dynamic.value.id)
  }
})

// 监听收藏状态变化
watch(() => collectionStore.getCollectionCount(route.params.id), (newCount) => {
  if (dynamic.value?.id) {
    collectCount.value = newCount
    isCollected.value = collectionStore.isPostCollected(dynamic.value.id)
  }
})

// 添加事件监听
onMounted(() => {
  // ... 其他代码 ...
  
  // 确保从 store 获取最新的收藏状态
  if (dynamic.value?.id) {
    const postId = dynamic.value.id
    const storeCollectCount = collectionStore.getCollectionCount(postId)
    collectCount.value = storeCollectCount
    isCollected.value = collectionStore.isPostCollected(postId)

    // 更新 dynamic 中的收藏状态
    dynamic.value = {
      ...dynamic.value,
      isCollected: isCollected.value,
      collectCount: storeCollectCount
    }
  }
})

// 添加收藏状态监听
watch(
  () => dynamic.value?.id,
  (newId) => {
    if (newId) {
      const storeCollectCount = collectionStore.getCollectionCount(newId)
      collectCount.value = storeCollectCount
      isCollected.value = collectionStore.isPostCollected(newId)

      // 更新 dynamic 中的收藏状态
      if (dynamic.value) {
        dynamic.value = {
          ...dynamic.value,
          isCollected: isCollected.value,
          collectCount: storeCollectCount
        }
      }
    }
  }
)

// 监听动态内容变化
watch(
  () => dynamic.value?.id,
  (newId) => {
    if (newId) {
      updateCollectionState(newId)
    }
  },
  { immediate: true }
)

// 在组件挂载时检查关注状态
onMounted(() => {
  if (dynamic.value?.userId) {
    const followingUsers = JSON.parse(localStorage.getItem('followingUsers') || '[]')
    isFollowing.value = followingUsers.some(user => user.id === dynamic.value.userId)
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
        <button class="follow-btn" @click="handleFollow">
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
  border: none;
  background-color: rgba(255, 105, 180, 0.8);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

.follow-btn:hover {
  background-color: rgba(255, 20, 147, 0.9);
}

.follow-btn:active {
  transform: scale(0.95);
}



/* 已关注状态的样式 */
.follow-btn.following {
  background-color: #eee;
  color: #666;
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