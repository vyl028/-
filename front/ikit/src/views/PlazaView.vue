<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/posts';

const router = useRouter();
const postStore = usePostStore();
const isLongMode = ref(true);
const hotTopics = ref([
  { id: 1, title: '2024动漫展即将开始' },
  { id: 2, title: '最受欢迎手办投票' },
  { id: 3, title: '漫展cos大赛报名' }
]);
const posts = ref([
  {
    id: 1,
    title: '二次元动漫展精彩回顾',
    image: '/src/assets/post1.jpg',
    username: '动漫迷小A',
    userAvatar: '/src/assets/avatar1.jpg',
    topComment: '这次的展会真的太棒了，特别是那个手办展区！'
  },
  {
    id: 2,
    title: '最新手办开箱分享',
    image: '/src/assets/post2.jpg',
    username: '手办控B君',
    userAvatar: '/src/assets/avatar2.jpg',
    topComment: '做工非常精致，完全值得入手'
  }
]);
const activities = ref([
  {
    id: 1,
    title: '二次元动漫展',
    description: '一年一度的动漫盛会...',
    image: '/src/assets/activity1.jpg'
  },
  {
    id: 2,
    title: '漫展cos大赛',
    description: '展示你的cos作品...',
    image: '/src/assets/activity2.jpg'
  }
])

const handleTabChange = (tab) => {
  if (tab === 'discover') {
    router.push('/');
  }
};

const handleViewAllTopics = () => {
  router.push('/topics')
}

const toggleViewMode = () => {
  isLongMode.value = !isLongMode.value;
};

const handleImageError = (e) => {
  if (!e.target.dataset.retried) {
    e.target.dataset.retried = true;
    e.target.src = '/src/assets/default-image.jpg';
  }
};

const handleAvatarError = (e) => {
  if (!e.target.dataset.retried) {
    e.target.dataset.retried = true;
    e.target.src = '/src/assets/default-avatar.jpg';
  }
};

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`);
};

const handleActivityClick = (activityId) => {
  router.push(`/activity/${activityId}`)
}

onMounted(async () => {
  try {
    await postStore.fetchPosts();
    posts.value = postStore.posts.map(post => ({
      ...post,
      image: post.image || '/src/assets/default-image.jpg',
      userAvatar: post.userAvatar || '/src/assets/default-avatar.jpg'
    }));
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
  hotTopics.value = [
    { id: 1, title: '热门话题1', image: '🌍' },
    { id: 2, title: '热门话题2', image: '🌍' },
    { id: 3, title: '热门话题3', image: '🌍' }
  ]
});
</script>

<template>
  <div class="plaza-page">
    <!-- 顶部标签页 -->
    <div class="tabs">
      <div 
        :class="['tab']"
        @click="handleTabChange('discover')"
      >发现</div>
      <div 
        :class="['tab', 'active']"
      >广场</div>
    </div>

    <div class="plaza-container">
      <!-- 搜索框 -->
      <div class="search-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="请输入您想要搜索的内容"
        />
      </div>

      <!-- 切换按钮 -->
      <div class="mode-switch">
        <span>切换长短图文</span>
        <div class="switch-button" :class="{ 'is-active': isLongMode }" @click="toggleViewMode"></div>
      </div>

      <!-- 默认模式（按钮开启状态） -->
      <template v-if="isLongMode">
        <div class="section">
          <div class="section-header">
            <h2>热门话题</h2>
            <span class="more" @click="handleViewAllTopics">全部 ></span>
          </div>
          <div class="topic-list">
            <div v-for="(topic, index) in hotTopics" :key="topic.id" class="topic-item">
              <span class="rank">{{ index + 1 }}</span>
              <span class="topic-title">{{ topic.title }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>热门活动</h2>
            <span class="more" @click="router.push('/activity')">全部 ></span>
          </div>
          <div class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <span class="rank">{{ activity.id }}</span>
              <span class="activity-title">{{ activity.title }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 瀑布流模式（按钮关闭状态） -->
      <div v-else class="waterfall-mode">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <img 
              v-if="post.image" 
              :src="post.image" 
              class="post-image" 
              @error="handleImageError"
              loading="lazy"
            >
            <div class="comment-section">
              <div class="user-info">
                <img 
                  :src="post.userAvatar" 
                  class="user-avatar" 
                  @error="handleAvatarError"
                  loading="lazy"
                >
                <span class="username">{{ post.username }}</span>
              </div>
              <p class="comment-text">{{ post.topComment }}</p>
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
}

.tabs {
  position: sticky;
  top: 0;
  display: flex;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #999;
  padding: 8px 0;
  cursor: pointer;
}

.tab.active {
  color: #333;
  font-weight: bold;
}

.plaza-container {
  padding: 16px;
  background: #fff;
}

.search-wrapper {
  margin-bottom: 20px;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 8px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 14px;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: bold;
}

.more {
  color: #999;
  font-size: 14px;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topic-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.rank {
  width: 24px;
  text-align: center;
  font-weight: bold;
}

.topic-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin: 0 12px;
}

.topic-title {
  flex: 1;
  font-size: 14px;
}

.mode-switch {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 16px;
}

.switch-button {
  width: 40px;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  margin-left: 8px;
  position: relative;
  transition: all 0.3s;
}

.switch-button::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.switch-button.is-active {
  background: #4a90e2;
}

.switch-button.is-active::after {
  transform: translateX(20px);
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
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
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
</style>
