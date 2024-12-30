<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommonTabs from '@/components/CommonTabs.vue'
import { useLikeStore } from '../stores/like'
import { useCollectionStore } from '../stores/collection'
import { getPosts, getCategoryPosts } from '@/api/posts'

const router = useRouter()
const route = useRoute()
const likeStore = useLikeStore()
const collectionStore = useCollectionStore()

// 定义分类导航数据
const navItems = [
  { text: '推荐', path: '/home' },
  { text: '原神', path: '/discover/yuanshen' },
  { text: '初音未来', path: '/discover/chuyin' },
  { text: '鬼灭之刃', path: '/discover/kimetsu' }
]

// 修改获取帖子的方法
const fetchPosts = async () => {
  try {
    const response = await getPosts()
    console.log('后端返回的原始数据:', response.data)
    
    posts.value = response.data.map(post => {
      console.log('处理前的单个帖子数据:', post)
      
      // 处理 postimages 字符串
      let images = []
      try {
        console.log('原始 postimages 字符串:', post.postimages)
        const imagesStr = post.postimages.replace(/'/g, '"')
        console.log('处理后的 postimages 字符串:', imagesStr)
        images = JSON.parse(imagesStr)
        console.log('解析后的图片数组:', images)
      } catch (e) {
        console.error('解析图片数组失败:', e)
        images = []
      }

      // 处理 posttags 字符串
      let tags = []
      try {
        console.log('原始 posttags 字符串:', post.posttags)
        const tagsStr = post.posttags.replace(/'/g, '"')
        console.log('处理后的 posttags 字符串:', tagsStr)
        tags = JSON.parse(tagsStr)
        console.log('解析后的标签数组:', tags)
      } catch (e) {
        console.error('解析标签数组失败:', e)
        tags = []
      }

      const processedPost = {
        id: post.id,
        username: post.username,
        userAvatar: post.avatar || '/src/assets/default-avatar.jpg',
        title: post.posttitle,
        content: post.postcontent,
        images: images,
        tags: tags,
        commentCount: post.comment_count,
        likeCount: post.like_count,
        collectCount: post.collect_count,
        isLiked: post.is_like,
        isCollected: post.is_collect,
        userId: post.userid
      }
      
      console.log('处理后的帖子数据:', processedPost)
      return processedPost
    })

    console.log('最终处理完的所有帖子数据:', posts.value)

    // 初始化点赞和收藏状态
    posts.value.forEach(post => {
      if (typeof likeStore.getLikeCount(post.id) === 'undefined') {
        likeStore.setInitialLikes(post.id, post.likeCount)
      }
      if (typeof collectionStore.getCollectionCount(post.id) === 'undefined') {
        collectionStore.setInitialCollections(post.id, post.collectCount)
      }
    })
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    console.error('错误详情:', error.response?.data)
  }
}

// 修改分类获取方法
const handleNavigation = async (path) => {
  const category = path.split('/').pop()
  console.log('当前选择的分类:', category)
  
  try {
    // 获取所有帖子
    const response = await getPosts()
    const allPosts = response.data.map(post => {
      let tags = []
      try {
        const tagsStr = post.posttags.replace(/'/g, '"')
        tags = JSON.parse(tagsStr)
      } catch (e) {
        console.error('解析标签数组失败:', e)
        tags = []
      }

      let images = []
      try {
        const imagesStr = post.postimages.replace(/'/g, '"')
        images = JSON.parse(imagesStr)
      } catch (e) {
        console.error('解析图片数组失败:', e)
        images = []
      }

      return {
        id: post.id,
        username: post.username,
        userAvatar: post.avatar || '/src/assets/default-avatar.jpg',
        title: post.posttitle,
        content: post.postcontent,
        images: images,
        tags: tags,
        commentCount: post.comment_count,
        likeCount: post.like_count,
        collectCount: post.collect_count,
        isLiked: post.is_like,
        isCollected: post.is_collect,
        userId: post.userid
      }
    })

    // 根据分类筛选帖子
    if (category === 'home') {
      posts.value = allPosts
    } else {
      const categoryMap = {
        'yuanshen': '原神',
        'chuyin': '初音未来',
        'kimetsu': '鬼灭之刃'
      }
      
      const targetTag = categoryMap[category]
      posts.value = allPosts.filter(post => 
        post.tags && post.tags.includes(targetTag)
      )
    }

    router.push(path)
  } catch (error) {
    console.error('获取帖子失败:', error)
  }
}


// 添加帖子数据(动态数据)
const posts = ref([
  {
    id: 1,
    username: '动漫迷小杰',
    userAvatar: '/src/assets/avatar1.jpg',
    title: '今天终于收到了期待已久的《鬼灭之刃》..',
    content: '最近入手了一个新的手办，质量非常好，大家看看怎么样？',
    images: [
      '/src/assets/post1.png',
      '/src/assets/post2.png',
      '/src/assets/post3.png'
    ],
    tags: ['手办', '鬼灭之刃', '开箱'],
    commentCount: 23
  },
  {
    id: 2,
    username: '手办达人莉莉',
    userAvatar: '/src/assets/avatar2.jpg',
    title: '手办修复记录',
    content: '最近我尝试了一下手办修复，效果非常不错！',
    images: ['/src/assets/post2.png'],
    tags: ['手办修复', '技术分享'],
    commentCount: 15
  },
  {
    id: 3,
    username: '小轩',
    userAvatar: '/src/assets/avatar3.jpg',
    title: '手办摄影作品分享',
    content: '最近参加了一场手办摄影大赛，今天来分享一下我的作品吧！',
    images: ['/src/assets/post3.png'],
    tags: ['手办摄影', '作品分享'],
    commentCount: 45
  },
  {
    id: 4,
    username: '游戏宅小明',
    userAvatar: '/src/assets/avatar4.jpg',
    title: '原神角色展示',
    content: '胡桃太米了，狠狠吃了附属。',
    images: ['/src/assets/post4.png'],
    tags: ['原神', '胡桃'],
    commentCount: 67
  },

  {
    id: 5,
    username: '小雪',
    userAvatar: '/src/assets/avatar4.jpg',
    title: '人活着就是为了初音未来！',
    content: '人活着就是为了初音未来！人活着就是为了初音未来！人活着就是为了初音未来！谁还没有初音妹妹我不说',
    images: ['/src/assets/post5.png'],
    tags: ['初音未来', '手办'],
    commentCount: 67
  }
])
// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

// 处理帖子点击，传递完整的帖子信息
const handlePostClick = (post) => {
  // 确保获取最新的点赞和收藏状态
  const currentLikeCount = likeStore.getLikeCount(post.id) || 0
  const currentIsLiked = likeStore.isPostLiked(post.id)
  const currentCollectCount = collectionStore.getCollectionCount(post.id) || 0
  const currentIsCollected = collectionStore.isPostCollected(post.id)

  const updatedPost = {
    ...post,
    userId: post.userId || post.id,
    likeCount: currentLikeCount,
    isLiked: currentIsLiked,
    collectCount: currentCollectCount,
    isCollected: currentIsCollected
  }

  // 更新本地状态
  const postIndex = posts.value.findIndex(p => p.id === post.id)
  if (postIndex !== -1) {
    posts.value[postIndex] = updatedPost
  }

  router.push({
    name: 'DynamicDetail',
    params: { id: post.id.toString() },
    state: { post: updatedPost }
  })
}

// 添加轮播图数据
const banners = ref([
  { id: 1, image: '/src/assets/shouye-banner1.jpg' },
  { id: 2, image: '/src/assets/shouye-banner2.jpg' },
  { id: 3, image: '/src/assets/shouye-banner3.jpg' }
])

const currentBanner = ref(0)
let autoPlayTimer = null  // 添加定时器变量

// 自动轮播
const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length
  }, 3000)
}

// 存储所有帖子的原始数据
const allPosts = ref([])

// 用于显示的帖子列表
const displayPosts = ref([])

// 处理帖子数据的计算属性
const processedPosts = computed(() => {
  return posts.value.map(post => ({
    ...post,
    likeCount: likeStore.getLikeCount(post.id),
    isLiked: likeStore.isPostLiked(post.id),
    collectCount: collectionStore.getCollectionCount(post.id),
    isCollected: collectionStore.isPostCollected(post.id)
  }))
})

// 监听收藏状态变化
watch(
  () => collectionStore.collections,
  () => {
    // 更新所有帖子的收藏状态
    posts.value = posts.value.map(post => ({
      ...post,
      collectCount: collectionStore.getCollectionCount(post.id),
      isCollected: collectionStore.isPostCollected(post.id)
    }))
  }
)

// 在组件挂载时获取数据
onMounted(async () => {
  await fetchPosts()
  startAutoPlay()
})

// 添加组件卸载时的清理函数
onUnmounted(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
})

// 修改点赞状态管理
const likedPosts = ref(new Set())
const postLikes = ref({})

// 处理点赞
const handleLike = async (post, event) => {
  event.stopPropagation()
  
  try {
    const newState = likeStore.toggleLike(post.id)
    // 更新当前帖子的点赞状态
    const postIndex = posts.value.findIndex(p => p.id === post.id)
    if (postIndex !== -1) {
      posts.value[postIndex] = {
        ...posts.value[postIndex],
        likeCount: likeStore.getLikeCount(post.id),
        isLiked: newState
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    showToast('操作失败，请重试')
  }
}

// 添加收藏状态监听
watch(
  () => posts.value,
  () => {
    posts.value.forEach(post => {
      if (!likeStore.getLikeCount(post.id)) {
        likeStore.setInitialLikes(post.id, post.likeCount || 0)
      }
      if (!collectionStore.getCollectionCount(post.id)) {
        collectionStore.setInitialCollections(post.id, post.collectCount || 0)
      }
    })
  },
  { immediate: true }
)
</script>
<template>
  <div class="home-page">
    <div class="top-section">
      <!-- 顶部标签页 -->
        <CommonTabs />
      <!-- 搜索框 -->
      <div class="search-box" @click="router.push('/search')">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor"
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input type="text" placeholder="搜索内容" readonly>
      </div>

      <div class="function-nav">
        <div v-for="(item, index) in navItems" :key="index" class="nav-item"
          :class="{ 'active': route.path.includes(item.path) }" @click="handleNavigation(item.path)">
          <span class="nav-text">{{ item.text }}</span>
        </div>
      </div>

      <!-- 轮播图 -->
      <div class="banner-container">
        <div class="banner-wrapper" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
          <div v-for="banner in banners" :key="banner.id" class="banner-slide">
            <img :src="banner.image" alt="banner">
          </div>
        </div>
        <div class="banner-dots">
          <span v-for="(banner, index) in banners" :key="banner.id"
            :class="['dot', { active: currentBanner === index }]" @click="currentBanner = index"></span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-grid">
      <div v-for="post in posts" :key="post.id" class="post-card" @click="handlePostClick(post)">
        <div class="post-image">
          <img :src="post.images[0]" alt="" /> <!-- 展示第一张图片 -->
        </div>
        <div class="post-info">
          <h3 class="post-username">{{ post.username }}</h3>
          <p class="post-title">{{ post.title }}</p>
          <div class="post-actions">
            <div class="like-btn" @click="handleLike(post, $event)">
              <svg class="like-icon" :class="{ 'liked': likeStore.isPostLiked(post.id) }" viewBox="0 0 24 24" width="20"
                height="20">
                <path fill="currentColor"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span class="like-count" :class="{ 'liked': likeStore.isPostLiked(post.id) }">
                {{ likeStore.getLikeCount(post.id) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #fff;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.top-section {
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  padding-bottom: 15px;
}


.search-box {
  margin: 10px 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-icon {
  color: #999;
  /* 图标颜色 */
  flex-shrink: 0;
  /* 防止图标被压缩 */
}
.search-box input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #333;
  /* 确保文字颜色足够深，于阅读 */
}

.function-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 15px;
  gap: 10px;
  background: transparent;
  margin-bottom: 0;
  position: relative;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.nav-text {
  font-size: 20px;
  color: #333;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

/* 荧光笔效果 */
.nav-item.active .nav-text {
  color: #FF69B4;
  font-weight: 500;
}

.nav-item.active .nav-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 9px;
  background: rgba(255, 105, 180, 0.2); /* 半透明粉色 */
  z-index: -1;
  border-radius: 1px;
  animation: highlightIn 0.3s ease;
}

@keyframes highlightIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100%;
    opacity: 1;
  }
}


/* 选中状态样式 */
.nav-item:hover .nav-text {
  transform: scale(1.05);
}

/* 选中状态文字样式 */
.nav-item.active .nav-text {
  color: #FF69B4;
  font-weight: 500;
}

/* 点击效果 */
.nav-item:active .nav-text {
  transform: scale(0.98);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
  margin-bottom: 60px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.post-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
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

.post-username {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  font-weight: normal;
}

.post-title {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0;
  line-height: 1.4;
}

.underline {
  position: absolute;
  bottom: 15px;
  height: 3px;
  background-color: #4CAF50;
  transition: all 0.3s ease;
  border-radius: 1.5px;
}

/* 确保激活状态的样式正确 */
.tab.active {
  font-weight: 500;
  color: #000;
}

/* 可选：添加悬停效果 */
.tab:hover {
  opacity: 0.8;
}

/* 调整导航项文字颜色，确保在渐变背景上清晰可见 */
.main-nav .nav-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 调整内容区域底部距，避免被导航栏遮挡 */
.content-grid {
  margin-bottom: 60px;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin-top: 15px;
}

.banner-wrapper {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
}

.banner-slide {
  flex: 0 0 100%;
  height: 100%;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: #fff;
}

/* 修改下划线样式 */
.underline {
  position: absolute;
  bottom: 15px;
  height: 3px;
  background-color: #4CAF50;
  border-radius: 1.5px;
  transition: all 0.3s ease;
}

.tab:last-child .underline {
  background-color: #808080;
  /* 广场时的灰色 */
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background-color: rgba(255, 105, 180, 0.1);
}

.like-icon {
  color: #666;
  transition: all 0.3s ease;
}

.like-icon.liked {
  color: #FF69B4;
  animation: heartPop 0.4s ease;
}

.like-count {
  font-size: 14px;
  color: #666;
  min-width: 20px;
}

.like-count.liked {
  color: #FF69B4;
}

@keyframes heartPop {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>

