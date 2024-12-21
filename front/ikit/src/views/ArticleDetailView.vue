<template>
  <div v-if="!isLoading && article" class="article-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="user-info" v-if="article?.author">
        <img 
          :src="article.author.avatar" 
          @error="handleAvatarError" 
          class="user-avatar" 
        />
        <span class="username">{{ article.author.username }}</span>
      </div>
      <div class="action-buttons">
        <button class="follow-btn" @click="handleFollow">
          {{ isFollowed ? '已关注' : '+ 关注' }}
        </button>
        <button class="share-btn" @click="handleShare">
          <svg class="share-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 文章内容区域 -->
    <div class="content-scroll">
      <h1 class="article-title">{{ article.title }}</h1>
      
      <div class="content-blocks">
        <template v-for="(block, index) in article.content" :key="index">
          <div v-if="block.type === 'text'" class="text-block">
            {{ block.content }}
          </div>
          <div v-else-if="block.type === 'subtitle'" class="subtitle-block">
            {{ block.content }}
          </div>
          <div v-else-if="block.type === 'image'" class="image-block">
            <img 
              :src="block.content"
              @error="handleImageError"
              class="content-image"
            />
            <p v-if="block.description" class="image-description">
              {{ block.description }}
            </p>
          </div>
        </template>

        <div class="tags">
          <span v-for="tag in article.tags" 
                :key="tag" 
                class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 评论区 -->
    <div class="comments-section">
      <h3 class="comments-title">评论 {{ comments.length }}</h3>
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
                <span class="reply-btn" @click="handleReply(comment)">回复</span>
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
          :placeholder="replyTo ? `回复 ${replyTo.username}` : '说点什么...'"
          @keyup.enter="submitComment"
        />
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
      <div class="send-btn" v-if="commentText.trim()" @click="submitComment">
        发送
      </div>
    </div>

    <!-- 添加写文章悬浮按钮 -->
    <div class="write-btn" @click="router.push('/article/edit')">
      <svg class="write-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useFollowStore } from '../stores/follow'

const route = useRoute()
const router = useRouter()
const followStore = useFollowStore()

// 文章数据和状态
const article = ref(null)
const comments = ref([])
const commentText = ref('')
const replyTo = ref(null)

// 交互状态
const isLoading = ref(true)
const isFollowed = ref(false)
const isLiked = ref(false)
const isCollected = ref(false)
const likeCount = ref(0)
const collectCount = ref(0)

// 初始化数据
onMounted(async () => {
  try {
    // 尝试从路由状态获取数据
    if (route.state?.article) {
      article.value = route.state.article
      likeCount.value = route.state.article.stats?.likes || 0
      collectCount.value = route.state.article.stats?.stars || 0
    } else {
      // 尝试从 localStorage 获取
      const savedArticle = localStorage.getItem(`article_${route.params.id}`)
      if (savedArticle) {
        const parsedArticle = JSON.parse(savedArticle)
        article.value = parsedArticle
        likeCount.value = parsedArticle.stats?.likes || 0
        collectCount.value = parsedArticle.stats?.stars || 0
      }
    }

    // 检查是否已关注
    if (article.value?.author?.id) {
      isFollowed.value = followStore.isFollowing(article.value.author.id)
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    showToast('加载失败，请重试')
  } finally {
    isLoading.value = false
  }
})

// 处理评论提交
const submitComment = () => {
  if (!commentText.value.trim()) {
    showToast('请输入评论内容')
    return
  }

  const newComment = {
    id: Date.now(),
    userAvatar: '/src/assets/default-avatar.jpg',
    username: '当前用户',
    content: commentText.value,
    time: '刚刚',
    isLiked: false,
    likeCount: 0
  }

  comments.value.unshift(newComment)
  commentText.value = ''
  replyTo.value = null
  showToast('评论成功')
}

// 处理点赞
const handleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
  showToast(isLiked.value ? '点赞成功' : '已取消点赞')
}

// 处理收藏
const handleCollect = () => {
  isCollected.value = !isCollected.value
  collectCount.value += isCollected.value ? 1 : -1
  showToast(isCollected.value ? '收藏成功' : '已取消收藏')
}

// 处理关注
const handleFollow = async () => {
  const userId = article.value?.author?.id
  if (userId) {
    try {
      if (isFollowed.value) {
        await followStore.unfollowUser(userId)
      } else {
        await followStore.followUser(userId)
      }
      isFollowed.value = !isFollowed.value
      showToast(isFollowed.value ? '关注成功' : '已取消关注')
    } catch (error) {
      console.error('关注操作失败:', error)
      showToast('操作失败，请重试')
    }
  }
}

// 处理分享
const handleShare = () => {
  const shareLink = `${window.location.origin}/article/${route.params.id}`
  navigator.clipboard.writeText(shareLink).then(() => {
    showToast('链接已复制')
  })
}

// 处理图片加载错误
const handleImageError = (e) => {
  e.target.src = '/src/assets/default-post.jpg'
}

// 处理头像加载错误
const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

// 处理评论点赞
const handleCommentLike = (comment) => {
  comment.isLiked = !comment.isLiked
  comment.likeCount += comment.isLiked ? 1 : -1
}

// 处理回复
const handleReply = (comment) => {
  replyTo.value = comment
  commentText.value = `@${comment.username} `
}
</script>

<style scoped>
.article-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 60px;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 100;
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

.content-scroll {
  padding: 16px;
  background: #fff;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
  line-height: 1.4;
}

.content-blocks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subtitle-block {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px;
  position: relative;
  padding-left: 12px;
}

.subtitle-block::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background: #FF69B4;
  border-radius: 2px;
}

.text-block {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  text-align: justify;
}

.content-image {
  width: 100%;
  border-radius: 8px;
  margin: 8px 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.content-image:hover {
  transform: scale(1.01);
}

/* 适配移动端 */
@media screen and (max-width: 768px) {
  .article-title {
    font-size: 20px;
  }
  
  .subtitle-block {
    font-size: 18px;
  }
  
  .text-block {
    font-size: 15px;
  }
}

/* 适配大屏幕 */
@media screen and (min-width: 769px) {
  .content-scroll {
    max-width: 800px;
    margin: 0 auto;
  }
}

/* 评���区样式 */
.comments-section {
  padding: 16px;
  background: #fff;
  margin-bottom: 60px;
}

.comments-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
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
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.comment-text {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.comment-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover {
  color: #FF69B4;
}

.like-btn:active {
  transform: scale(0.95);
}

.like-icon {
  color: #999;
  transition: all 0.3s ease;
}

.like-btn.liked .like-icon {
  color: #FF69B4;
}

.like-count {
  font-size: 12px;
  color: #999;
}

.reply-btn {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reply-btn:hover {
  color: #FF69B4;
}

.reply-btn:active {
  transform: scale(0.95);
}

.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fff;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 100;
  backdrop-filter: blur(5px);
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 20px;
  background-color: #f5f5f5;
}

.send-btn {
  padding: 8px 16px;
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

.send-btn:hover {
  background-color: rgba(255, 20, 147, 0.9);
}

.send-btn:active {
  transform: scale(0.95);
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  color: #FF69B4;
}

.action-item:active {
  transform: scale(0.95);
}

.icon {
  color: #999;
  transition: all 0.3s ease;
}

.action-item.liked .icon {
  color: #FF69B4;
}

.count {
  font-size: 12px;
  color: #999;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.loading-spinner {
  color: #666;
  font-size: 14px;
}

/* 添加写文章按钮样式 */
.write-btn {
  position: fixed;
  right: 20px;
  bottom: 120px; /* 位于评论框上方 */
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

.write-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
}

.write-btn:active {
  transform: scale(0.95);
}

.write-icon {
  color: white;
}
</style> 