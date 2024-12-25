<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFollowStore } from '../stores/follow'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const isFollowing = ref(false)
const commentText = ref('')
const replyTo = ref(null)

// 获取帖子数据
const dynamic = ref(null)

// 模拟数据库中的帖子数据
const mockPosts = [
  {
    id: 1,
    userId: 1,
    username: '动漫迷小杰',
    userAvatar: '/src/assets/avatar1.jpg',
    title: '今天终于收到了期待已久的《鬼灭之刃》..',
    content: '今天终于收到了期待已久的《鬼灭之刃》炭治郎手办，拆开包装的那一刻真是惊艳到了！手办的细节处理得非常到位，从服装的褶皱到武器的质感都栩栩如生。炭治郎的表情也刻画得十分传神，仿佛能感受到他的决心和勇气。这次入手真是太值了！',
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
    content: '人活着就是为了初音未来！人活着就是为了初音未来！人活着就是为了初音未来！谁还没有初音妹妹我不说',
    images: ['/src/assets/post5.png'],
    tags: ['初音未来', '手办'],
    commentCount: 67
  }
]

const followStore = useFollowStore()

onMounted(async () => {
  try {
    const postId = route.params.id
    // 优先使用路由传递的状态数据
    if (route.state?.post) {
      dynamic.value = route.state.post
    } else {
      // 如果没有状态数据，再从 mockPosts 中查找
      const foundPost = mockPosts.find(post => post.id.toString() === postId)
      dynamic.value = foundPost || mockPosts[0]
    }
    
    // 初始化 followStore
    await followStore.fetchFollows();
    
    // 检查是否已关注该用户
    if (dynamic.value?.userId) {
      isFollowing.value = followStore.isFollowing(dynamic.value.userId)
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
  }
})

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
      await followStore.unfollowUser(Number(dynamic.value.userId))
      isFollowing.value = false
    } else {
      // 保存完整的帖子数据
      const postData = {
        id: dynamic.value.id,
        userId: Number(dynamic.value.userId),
        username: dynamic.value.username,
        userAvatar: dynamic.value.userAvatar,
        title: dynamic.value.title,
        content: dynamic.value.content,
        images: dynamic.value.images,
        tags: dynamic.value.tags,
        commentCount: dynamic.value.commentCount
      }
      
      // 保存到 localStorage
      const storedPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
      const updatedPosts = [...storedPosts, postData]
      localStorage.setItem('allPosts', JSON.stringify(updatedPosts))
      
      // 关注用户
      const userInfo = {
        id: Number(dynamic.value.userId),
        name: dynamic.value.username,
        avatar: dynamic.value.userAvatar
      }
      await followStore.followUser(Number(dynamic.value.userId), userInfo)
      isFollowing.value = true
    }
    showToast(isFollowing.value ? '关注成功' : '已取消关注')
  } catch (error) {
    console.error('关注操作失败:', error)
    showToast('操作失败，请重试')
  }
}

// 处理转发
const handleShare = () => {
  // 实现转发逻辑
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

// 添加状态
const isLiked = ref(false)
const isCollected = ref(false)
const likeCount = ref(1234)
const collectCount = ref(56)

// 处理点赞
const handleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

// 处理收藏
const handleCollect = () => {
  isCollected.value = !isCollected.value
  collectCount.value += isCollected.value ? 1 : -1
}

// 处理输入框聚焦
const handleInputFocus = () => {
  // 这里可以添加聚焦时的逻辑
}
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
        <button class="share-btn" @click="handleShare">
          <svg class="share-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
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
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
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
          <svg class="icon" :class="{ 'liked': isLiked }" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="count">{{ likeCount }}</span>
        </div>
        <div class="action-item" @click="handleCollect">
          <svg class="icon" :class="{ 'collected': isCollected }" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <span class="count">{{ collectCount }}</span>
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

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-icon {
  color: rgba(102, 102, 102, 0.8);
  transition: all 0.3s ease;
}

.share-btn:hover .share-icon {
  color: #333;
  transform: scale(1.1);
}

.share-btn:active {
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
  color: #666;
  transition: all 0.3s ease;
  width: 24px;
  height: 24px;
}

.count {
  font-size: 14px;
  color: #666;
  min-width: 24px;
  transition: all 0.3s ease;
}

/* 点赞效果 */
.icon.liked {
  color: #FF69B4;
  animation: heartPop 0.4s ease;
}

.action-item:hover .icon:not(.liked) {
  color: #FF69B4;
  opacity: 0.7;
}

.action-item .icon.liked + .count {
  color: #FF69B4;
  animation: countPop 0.4s ease;
}

/* 收藏效果 */
.icon.collected {
  color: #FFD700;
  animation: starPop 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.action-item:hover .icon:not(.collected) {
  color: #FFD700;
  opacity: 0.7;
}

.action-item .icon.collected + .count {
  color: #FFD700;
  animation: countPop 0.4s ease;
}

/* 动画效果 */
@keyframes heartPop {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes starPop {
  0% { transform: scale(1) rotate(0); }
  25% { transform: scale(1.2) rotate(20deg); }
  50% { transform: scale(0.95) rotate(-10deg); }
  100% { transform: scale(1) rotate(0); }
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
</style>