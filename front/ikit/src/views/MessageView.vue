<template>
  <div class="message-container">
    <div class="header">
      <div class="title">消息</div>
      <div class="settings-icon">⚙️</div>
    </div>

    <!-- 消息类型导航 -->
    <div class="message-nav">
      <div class="nav-item">
        <div class="nav-icon">💬</div>
        <div class="nav-text">回复我的</div>
      </div>
      <div class="nav-item">
        <div class="nav-icon">@</div>
        <div class="nav-text">@我</div>
      </div>
      <div class="nav-item">
        <div class="nav-icon">👍</div>
        <div class="nav-text">收到的赞</div>
      </div>
      <div class="nav-item">
        <div class="nav-icon">⭐</div>
        <div class="nav-text">收藏了我</div>
      </div>
    </div>

    <div class="message-list">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message-item"
        @click="handleMessageClick(message)"
      >
        <img 
          :src="message.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="message-content">
          <div class="message-top">
            <span class="username">{{ message.username }}</span>
            <span class="time">{{ message.time }}</span>
          </div>
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const userStore = useUserStore()

// 静态消息数据
const messages = ref([
  {
    id: 1,
    username: '系统通知',
    avatar: '/src/assets/system-avatar.png',
    content: '欢迎使用本应用',
    time: '刚刚',
    unread: true
  },
  {
    id: 2,
    username: '活动通知',
    avatar: '/src/assets/activity-avatar.png',
    content: '您关注的活动即将开始',
    time: '10分钟前',
    unread: false
  }
])

const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const handleMessageClick = (msg) => {
  msg.unread = false
  // 后续可以添加跳转到消息详情的逻辑
}
</script>

<style scoped>
.message-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}

.header {
  padding: 15px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.settings-icon {
  font-size: 20px;
  padding: 5px;
}

.message-nav {
  display: flex;
  justify-content: space-around;
  padding: 20px 10px;
  background: #fff;
  margin-bottom: 10px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nav-icon {
  font-size: 24px;
  width: 45px;
  height: 45px;
  background: #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  font-size: 12px;
  color: #666;
}

.message-list {
  background: #fff;
}

.message-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.message-content {
  flex: 1;
}

.message-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.username {
  font-size: 15px;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.message-text {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>
