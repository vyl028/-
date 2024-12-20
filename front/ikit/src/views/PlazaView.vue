<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/posts';

const router = useRouter();
const postStore = usePostStore();
const hotTopics = ref([
  { 
    id: 1, 
    title: '热门二次元手办收藏指南：哪些角色手办正风靡？' 
  },
  { 
    id: 2, 
    title: '手办模型制作教程：从零开始的创造之旅' 
  },
  { 
    id: 3, 
    title: '二次元手办市场趋势：未来热门何在？' 
  }
]);
const posts = ref([
  {
    id: 1,
    username: '不吃香菜',
    userAvatar: '/src/assets/avatar1.jpg',
    title: '龙族番外',
    image: '/src/assets/wenzhang1.jpg',
    content: [
      {
        type: 'text',
        content: '今天和大家分享一下龙族番外的内容解析。这部作品延续了龙族一贯的精彩剧情和深度设定...'
      },
      {
        type: 'subtitle',
        content: '人物关系'
      },
      {
        type: 'text',
        content: '番外主要讲述了路明非和楚子航在校园时期的故事，展现了他们之间深厚的友谊...'
      }
    ],
    views: 1234,
    likes: 88,
    stars: 32,
    tags: ['龙族', '路明非', '楚子航', '小说', '番外']
  },
  {
    id: 2,
    username: '二次元达人',
    userAvatar: '/src/assets/avatar2.jpg',
    title: '手办修复日志：从破损到焕新',
    image: ['/src/assets/wenzhang2-1.png','/src/assets/wenzhang2-2.png','/src/assets/wenzhang2-3.png',
            '/src/assets/wenzhang2-4.png','/src/assets/wenzhang2-5.png','/src/assets/wenzhang2-6.png',
            '/src/assets/wenzhang2-7.png'],
    content: [
      {
        type: 'text',
        content: '今天要和大家分享一个破损手办的修复过程。这是一个已经使用多年的初音未来手办，由于不当存放导致多处破损。'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-1.png',
        description: '破损的初音手办整体图'
      },
      {
        type: 'text',
        content: '首先对破损部位进行清理和固定。使用专业的模型修复工具，小心地处理断裂的边缘。'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-2.png',
        description: '修复工具和材料准备'
      },
      {
        type: 'text',
        content: '接下来使用环氧树脂进行粘合。这个步骤需要特别注意，因为环氧树脂的固化时间有限。'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-3.png',
        description: '粘合修复过程'
      },
      {
        type: 'subtitle',
        content: '色彩修复阶段'
      },
      {
        type: 'text',
        content: '粘合完成后，需要进行细致的打磨和上色。使用专业的模型涂料，一点一点还原原有的色彩。'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-4.png',
        description: '色彩修复中'
      },
      {
        type: 'text',
        content: '最难的部分是头发的渐变色处理，需要多次调色和试验才能达到理想效果。'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-5.png',
        description: '头发部分修复'
      },
      {
        type: 'subtitle',
        content: '最终效果'
      },
      {
        type: 'text',
        content: '经过近一周的修复工作，这个破损的手办终于恢复了往日的光彩。'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-6.png',
        description: '修复后整体效果'
      },
      {
        type: 'text',
        content: '修复后的手办放在专门的展示柜中，避免再次受损。希望这个修复日志能给大家一些参考！'
      },
      {
        type: 'image',
        content: '/src/assets/wenzhang2-7.png',
        description: '展示柜陈列效果'
      }
    ],
    views: 2345,
    likes: 120,
    stars: 45,
    tags: ['手办修复', '初音未来', '教程', 'DIY']
  }
]);
const activities = ref([
  { id: 1, title: '广州暑期City walk，打卡正佳星球跨次元狂欢' },
  { id: 2, title: '“二次元”走进现实，老商场焕发生机' },
  { id: 3, title: '最新二次元主题街区，亮相民盈·国贸城' }
])

const activeTab = ref('plaza');
const underlineStyle = ref({ width: '0px', left: '0px' });

const updateUnderlinePosition = () => {
  const activeTabElement = activeTab.value === 'discover' 
    ? document.querySelector('.tab:first-child') 
    : document.querySelector('.tab:last-child')
    
  if (activeTabElement) {
    const { width, left } = activeTabElement.getBoundingClientRect()
    const parentLeft = activeTabElement.parentElement.getBoundingClientRect().left
    underlineStyle.value = {
      width: `${width}px`,
      left: `${left - parentLeft}px`
    }
  }
}

const handleTabChange = (tab) => {
  activeTab.value = tab;
  if (tab === 'plaza') {
    router.push('/plaza')
  } else if (tab === 'discover') {
    router.push('/home')
  }
  nextTick(() => {
    updateUnderlinePosition();
  });
};

const handleViewAllTopics = () => {
  router.push('/topics')
}

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-post.jpg'
};

const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
};

const handlePostClick = (post) => {
  const articleData = {
    id: post.id,
    title: post.title || '无标题',
    author: {
      username: post.username || '未知用户',
      avatar: post.userAvatar || '/src/assets/default-avatar.jpg'
    },
    content: post.content || [
      {
        type: 'text',
        content: post.title || '暂无内容'
      }
    ],
    stats: {
      views: post.views || 0,
      likes: post.likes || 0,
      stars: post.stars || 0
    },
    images: Array.isArray(post.image) ? post.image : [post.image],
    tags: post.tags || ["同人", "手办", "修复"]
  }

  localStorage.setItem(`article_${post.id}`, JSON.stringify(articleData))

  router.push({
    name: 'ArticleDetail',
    params: { id: post.id },
    state: { article: articleData }
  })
}

const handleActivityClick = (activityId) => {
  router.push(`/activity/${activityId}`)
}

onMounted(async () => {
  updateUnderlinePosition();
});

// 获取要显示的图片
const getDisplayImage = (post) => {
  if (Array.isArray(post.image)) {
    return post.image[0];
  }
  return post.image;
};
</script>

<template>
  <div class="plaza-page">
    <div class="top-section">
      <!-- 顶部标签页 -->
      <div class="tabs">
        <div 
          :class="['tab', activeTab === 'discover' ? 'active' : '']"
          @click="handleTabChange('discover')"
        >发现</div>
        <div 
          :class="['tab', activeTab === 'plaza' ? 'active' : '']"
          @click="handleTabChange('plaza')"
        >广场</div>
        <div class="underline" :style="underlineStyle"></div>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" placeholder="搜索感兴趣的内容">
      </div>
    </div>

    <div class="plaza-container">
      <!-- 话题区域 -->
      <div class="section">
        <div class="section-header">
          <h2>话题</h2>
          <span class="more" @click="handleViewAllTopics">全部话题 ></span>
        </div>
        <div class="topic-container">
          <div class="topic-list">
            <div v-for="(topic, index) in hotTopics" :key="topic.id" class="topic-item">
              <div class="rank-icon" :class="`rank-${index + 1}`">
                <span class="fire-icon">🔥</span>
                <span class="rank-number">{{ index + 1 }}</span>
              </div>
              <span class="topic-title">{{ topic.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 活动区域 -->
      <div class="section">
        <div class="section-header">
          <h2>热门活动</h2>
          <span class="more" @click="router.push('/activity')">全部活动 ></span>
        </div>
        <div class="activity-container">
          <div class="activity-list">
            <div v-for="(activity, index) in activities" :key="activity.id" class="activity-item">
              <div class="rank-icon" :class="`rank-${index + 1}`">
                <span class="fire-icon">🔥</span>
                <span class="rank-number">{{ index + 1 }}</span>
              </div>
              <span class="activity-title">{{ activity.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章帖子列表 -->
      <div class="posts-section">
        <div v-for="post in posts" :key="post.id" class="post-card" @click="handlePostClick(post)">
          <div class="post-header">
            <img 
              :src="post.userAvatar" 
              class="user-avatar"
              @error="handleAvatarError"
            >
            <span class="username">{{ post.username }}</span>
          </div>
          <div class="post-content">
            <div class="post-info">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-stats">
                <div class="stat-item">
                  <i class="icon-eye">👁️</i>
                  <span>{{ post.views }}</span>
                </div>
                <div class="stat-item">
                  <i class="icon-like">❤️</i>
                  <span>{{ post.likes }}</span>
                </div>
                <div class="stat-item">
                  <i class="icon-star">⭐</i>
                  <span>{{ post.stars }}</span>
                </div>
              </div>
            </div>
            <div class="post-image-container">
              <img 
                :src="getDisplayImage(post)" 
                class="post-image"
                @error="handleImageError"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plaza-page {
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

.tabs {
  position: sticky;
  top: 0;
  display: flex;
  background: transparent;
  padding: 0 16px;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}

.tab {
  flex: 1;
  width: 60px;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 43.44px;
  text-align: center;
  opacity: 1;
}

.tab:first-child {
  left: 96px;
  top: 21px;
  height: 51px;
  color: rgba(128, 128, 128, 1);
}

.tab:last-child {
  left: 200px;
  top: 21px;
  height: 51px;
  color: rgba(0, 0, 0, 1);
}

.tab.active {
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
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
  flex-shrink: 0;
}

.search-box input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #333;
}

.underline {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: #4CAF50;
  transition: all 0.3s ease;
}

.section {
  padding: 16px 0;
  background: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 16px;
}

.section-header h2 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.more {
  font-size: 12px;
  color: #999;
}

.topic-container, .activity-container {
  background: #FFF3EA;
  border-radius: 12px;
  padding: 12px;
  margin: 0 16px;
}

.topic-list, .activity-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.topic-item, .activity-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: transparent;
  border-radius: 8px;
  gap: 8px;
}

.rank-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fire-icon {
  position: absolute;
  font-size: 24px;
}

.rank-number {
  position: relative;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  z-index: 1;
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

.topic-title, .activity-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.divider {
  height: 8px;
  background-color: #f5f5f5;
  width: 100%;
  margin: 16px 0;
}

.content-list {
  padding: 12px;
}

.post-item {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.post-header {
  padding: 12px;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.waterfall-list {
  padding: 8px;
  column-count: 2;
  column-gap: 8px;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.waterfall-item .post-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
}

.waterfall-item .post-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.waterfall-item .post-info {
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

.waterfall-layout {
  padding: 12px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  padding: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-content {
  padding: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.post-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12px;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #999;
  font-size: 12px;
}

/* 瀑布流模式样式 */
.waterfall-mode {
  padding: 12px;
  background: #fff;
}

.post-card {
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.post-header {
  padding: 12px;
  display: flex;
  align-items: center;
  background: #fff;
}

.post-content {
  padding: 12px;
  background: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.post-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.post-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #999;
  font-size: 12px;
}

/* 活动列表样式 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  padding: 12px;
}

.activity-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 12px;
}

.activity-info {
  flex: 1;
}

.activity-info h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.activity-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 修改默认模式的样式以匹配设计图 */
.topic-item, .activity-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.rank {
  width: 24px;
  text-align: center;
  font-weight: bold;
}

.topic-image, .activity-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin: 0 12px;
}

.topic-title, .activity-title {
  flex: 1;
  font-size: 14px;
}

/* 修改切换按钮样式 */
.mode-switch {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 16px;
}

.topic-item, .activity-item {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.rank {
  width: 24px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-right: 12px;
}

.topic-title, .activity-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

/* 瀑布流模式样式 */
.waterfall-mode {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-content {
  padding: 16px;
}

.post-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 12px;
  border-radius: 4px;
}

.comment-section {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

.user-info {
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

.username {
  font-size: 14px;
  color: #666;
}

.comment-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.posts-section {
  padding: 16px;
  background: #fff;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.post-header {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.post-title {
  padding: 0 12px;
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: normal;
  color: #333;
  line-height: 1.4;
}

.post-image-container {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 添加卡片之间的分隔 */
.post-card:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.post-card {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  color: #333;
}

.post-content {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-title {
  display: -webkit-box;
  line-clamp: 2;                /* 标准属性 */
  -webkit-line-clamp: 2;        /* WebKit浏览器支持 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

.post-image-container {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 图标样式 */
.icon-eye, .icon-like, .icon-star {
  font-size: 14px;
}

.post-images-container {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.post-images-container.multiple-images {
  width: 180px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  height: 100%;
}

.images-grid .post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.images-grid .post-image:first-child {
  grid-column: 1 / -1;
  grid-row: 1;
}

.more-images {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  grid-column: 2;
  grid-row: 2;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
