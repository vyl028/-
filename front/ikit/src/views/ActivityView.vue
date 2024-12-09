<template>
  <div class="activity-container">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">全部活动</div>
    </div>

    <div class="activity-list">
      <div 
        v-for="(activity, index) in activities" 
        :key="index"
        class="activity-item"
        @click="navigateToDetail(activity.id)"
      >
        <img 
          :src="activity.image" 
          class="activity-image"
          @error="handleImageError"
        />
        <div class="activity-info">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-time">活动时间：{{ activity.startDate }}-{{ activity.endDate }}</div>
        </div>
        <span 
          class="collect-icon" 
          :class="{ 'collected': activity.isCollected }"
          @click.stop="handleCollect(index)"
        >★</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

// 静态活动数据
const activities = ref([
  {
    id: 1,
    title: '北京CCW华彩国际动漫游戏展',
    image: '/src/assets/static/activity/ccw.jpg',
    startDate: '1月1日',
    endDate: '1月3日',
    isCollected: false
  },
  {
    id: 2,
    title: '上海CP28动漫展',
    image: '/src/assets/static/activity/cp.jpg',
    startDate: '2月1日',
    endDate: '2月3日',
    isCollected: false
  },
  {
    id: 3,
    title: '广州萤火虫动漫展',
    image: '/src/assets/static/activity/yhc.jpg', 
    startDate: '3月1日',
    endDate: '3月3日',
    isCollected: false
  }
])

const navigateToDetail = (id) => {
  router.push(`/activity/detail/${id}`)
}

const handleCollect = async (index) => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    return
  }
  activities.value[index].isCollected = !activities.value[index].isCollected
  showToast(activities.value[index].isCollected ? '收藏成功' : '取消收藏')
}

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-activity.jpg'
}
</script>

<style scoped>
.activity-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 44px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 100;
}

.back-icon {
  font-size: 24px;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.activity-list {
  padding: 10px;
}

.activity-item {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
}

.activity-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.activity-info {
  padding: 10px;
}

.activity-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 14px;
  color: #666;
}

.collect-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.collect-icon.collected {
  color: #ffd700;
}
</style> 