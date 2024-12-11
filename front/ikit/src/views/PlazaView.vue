<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/posts';

const router = useRouter();
const postStore = usePostStore();

const hotTopics = ref([]);
const hotActivities = ref([]);

const handleTabChange = (tab) => {
  if (tab === 'discover') {
    router.push('/');
  }
};

const handleViewAllTopics = () => {
  router.push('/topics')
}

onMounted(async () => {
    await postStore.fetchPosts();
    hotTopics.value = [
      { id: 1, title: '热门话题1', image: '🌍' },
      { id: 2, title: '热门话题2', image: '🌍' },
      { id: 3, title: '热门话题3', image: '🌍' }
    ]
})
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
          placeholder="请输入搜索内容"
        />
      </div>

      <!-- 热门话题 -->
      <div class="section">
        <div class="section-header">
          <h2>热门话题</h2>
          <span class="more" @click="handleViewAllTopics">全部 ></span>
        </div>
        <div class="topic-list">
          <div v-for="topic in hotTopics" 
            :key="topic.id"
            class="topic-item"    
          >
            <span class="rank">{{ topic.id }}</span>
            <img :src="topic.image" class="topic-image">
            <span class="topic-title">{{ topic.title }}</span>
          </div>
        </div>
      </div>

      <!-- 热门活动 -->
      <div class="section">
        <div class="section-header">
          <h3>热门活动</h3>
          <div class="more" @click="router.push('/activity')">全部</div>
        </div>
        <div class="topic-list">
          <div v-for="topic in hotTopics" 
            :key="topic.id"
            class="topic-item"    
          >
            <span class="rank">{{ topic.id }}</span>
            <img :src="topic.image" class="topic-image">
            <span class="topic-title">{{ topic.title }}</span>
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
}

.search-wrapper {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #eee;
  background: #f5f5f5;
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
  background: #f5f5f5;
  border-radius: 8px;
}

.rank {
  width: 24px;
  font-weight: bold;
  color: #333;
}

.topic-image {
  width: 40px;
  height: 40px;
  margin: 0 12px;
  border-radius: 4px;
}

.topic-title {
  flex: 1;
  font-size: 14px;
}
</style>
