<template>
  <div class="article-container">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">文章详情</div>
    </div>

    <div v-if="articleStore.isLoading" class="loading">
      加载中...
    </div>

    <div class="content-scroll" v-else-if="article">
      <div class="article-content">
        <h1 class="title">{{ article?.title }}</h1>
        
        <div class="tags" v-if="article?.tags?.length">
          <span 
            v-for="(tag, index) in article.tags" 
            :key="index" 
            class="tag"
          >#{{ tag }}</span>
        </div>

        <div class="content-blocks">
          <template v-for="(block, index) in article.blocks" :key="index">
            <div v-if="block.type === 'subtitle'" class="subtitle-block">
              {{ block.content }}
            </div>
            <div v-if="block.type === 'text'" class="text-block">
              {{ block.content }}
            </div>
            <img 
              v-if="block.type === 'image'" 
              :src="block.content" 
              class="content-image"
              @click="previewImage(block.content)"
            />
          </template>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section" v-if="article?.comments">
        <div class="comments-header">
          <span class="comments-title">评论 ({{ article.comments.length }})</span>
        </div>
        <div class="comment-list">
          <div 
            class="comment-item" 
            v-for="(comment, index) in article.comments" 
            :key="index"
          >
            <img class="comment-avatar" :src="comment.avatar" @error="handleAvatarError"/>
            <div class="comment-right">
              <span class="comment-username">{{ comment.username }}</span>
              <span class="comment-content">{{ comment.content }}</span>
              <div class="comment-footer">
                <span class="comment-time">{{ comment.time }}</span>
                <span class="reply-btn" @click="replyComment(comment)">回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">加载中...</div>

    <!-- 底部评论框 -->
    <div class="comment-box">
      <input 
        type="text" 
        :placeholder="replyTo ? `回复 @${replyTo.username}` : '说点什么...'"
        v-model="commentText"
        @focus="onCommentFocus"
      />
      <span 
        class="send-btn" 
        @click="sendComment" 
        :class="{ 'active': commentText.length > 0 }"
      >发送</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { showToast, ImagePreview } from 'vant'
import { addComment, followAuthor } from '@/api/article'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const article = ref(null)
const isFollowed = ref(false)
const commentText = ref('')
const replyTo = ref(null)
const statusBarHeight = ref(0)
const categories = ref(['推荐', '最新', '热门'])
const currentCategory = ref('推荐')

// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    await articleStore.fetchArticleDetail(route.params.id)
    article.value = articleStore.currentArticle
    if (!article.value) {
      showToast('文章不存在')
      router.back()
    }
  } catch (error) {
    showToast('获取文章详情失败')
    router.back()
  }
}

onMounted(() => {
  // 在 Web 端，状态栏高度为 0
  statusBarHeight.value = 0
  fetchArticleDetail()
})

// 处理关注
const handleFollow = async () => {
  try {
    await followAuthor(article.value.authorId)
    isFollowed.value = !isFollowed.value
    showToast({
      message: isFollowed.value ? '关注成功' : '已取消关注',
      position: 'bottom'
    })
  } catch (error) {
    showToast('操作失败，请重试')
  }
}

// 处理分享
const handleShare = () => {
  const shareLink = `${window.location.origin}/article/${route.params.id}`
  navigator.clipboard.writeText(shareLink).then(() => {
    showToast({
      message: '链接已复制',
      position: 'bottom'
    })
  })
}

// 图片预览
const previewImage = (url) => {
  ImagePreview({
    images: [url],
    showIndex: false,
    closeable: true,
  })
}

// 处理评论
const sendComment = async () => {
  if (!commentText.value.trim()) return
  
  try {
    await addComment(route.params.id, {
      content: commentText.value,
      replyTo: replyTo.value?.id
    })
    
    commentText.value = ''
    replyTo.value = null
    await fetchArticleDetail() // 重新获取文章详情以更新评论列表
    
    showToast({
      message: '评论成功',
      position: 'bottom'
    })
  } catch (error) {
    showToast('��论失败，请重试')
  }
}

// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.content-scroll')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

const replyComment = (comment) => {
  replyTo.value = comment
  scrollToBottom()
}

const handleCategoryChange = (category) => {
  currentCategory.value = category
  // 这里可以根据分类加载不同的文章
}
</script> 

<style scoped>
.article-container {
  min-height: 100vh;
  background: #f5f5f5;
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
  z-index: 100;
}

.back-icon {
  font-size: 24px;
  padding: 5px 10px;
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.content-scroll {
  padding: 15px;
  background: #fff;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style> 