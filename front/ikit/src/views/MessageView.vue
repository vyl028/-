<template>
  <div class="message-container">
    <div class="title-header">
      <h1 class="title">消息</h1>
    </div>

    <!-- 消息类型导航 -->
    <div class="message-nav">
      <div class="nav-item" @click="showReplyMessages">
        <div class="nav-icon">
          <img src="@/assets/messages/reply.png" alt="回复我的">
        </div>
        <div class="nav-text">回复我的</div>
      </div>
      <div class="nav-item" @click="showAtMessages">
        <div class="nav-icon">
          <img src="@/assets/messages/at.png" alt="@我的">
        </div>
        <div class="nav-text">@我</div>
      </div>
      <div class="nav-item" @click="showLikeMessages">
        <div class="nav-icon">
          <img src="@/assets/messages/like.png" alt="收到的赞">
        </div>
        <div class="nav-text">收到的赞</div>
      </div>
      <div class="nav-item" @click="showPrivateMessages">
        <div class="nav-icon">
          <img src="@/assets/messages/secret.png" alt="私信">
        </div>
        <div class="nav-text">私信</div>
      </div>
    </div>

    <!-- 全部消息列表 -->
    <div v-if="currentTab === 'all'" class="list">
      <div 
        v-for="all in allMessages" 
        :key="all.id"
        class="item"
      >
        <img 
          :src="all.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="content">
          <div class="header">
            <span class="username">{{ all.username }}</span>
            <span class="time">{{ all.time }}</span>
          </div>
          <div class="text">{{ all.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ all.sourceType }}:</span>
            <span class="source-text">{{ all.sourceContent }}</span>
          </div>
          <div class="divider"></div>
        </div>        
      </div>
    </div>

    <!-- 回复消息列表 -->
    <div v-if="currentTab === 'reply'" class="list">
      <div 
        v-for="reply in replyMessages" 
        :key="reply.id"
        class="item"
      >
        <img 
          :src="reply.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="content">
          <div class="header">
            <span class="username">{{ reply.username }}</span>
            <span class="time">{{ reply.time }}</span>
          </div>
          <div class="text">{{ reply.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ reply.sourceType }}:</span>
            <span class="source-text">{{ reply.sourceContent }}</span>
          </div>
          <div class="divider"></div>
        </div>        
      </div>
    </div>

    <!-- @消息列表 -->
    <div v-if="currentTab === 'at'" class="list">
      <div 
        v-for="at in atMessages" 
        :key="at.id"
        class="item"
      >
        <img 
          :src="at.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="content">
          <div class="header">
            <span class="username">{{ at.username }}</span>
            <span class="time">{{ at.time }}</span>
          </div>
          <div class="text">{{ at.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ at.sourceType }}:</span>
            <span class="source-text">{{ at.sourceContent }}</span>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </div>

    <!-- 点赞消息列表 -->
    <div v-if="currentTab === 'like'" class="list">
      <div 
        v-for="like in likeMessages" 
        :key="like.id"
        class="item"
      >
        <img 
          :src="like.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="content">
          <div class="header">
            <span class="username">{{ like.username }}</span>
            <span class="time">{{ like.time }}</span>
          </div>
          <div class="text">{{ like.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ like.sourceType }}:</span>
            <span class="source-text">{{ like.sourceContent }}</span>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </div>

    <!-- 私信界面 -->
    <div v-if="currentTab === 'private'" class="list">
      <div 
        v-for="secret in privateMessages" 
        :key="secret.id"
        class="item"
        @click="goToDetail(secret.id)"
      >
        <img 
          :src="secret.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="content">
          <div class="header">
            <span class="username">{{ secret.username }}</span>
            <span class="time">{{ secret.time }}</span>
          </div>
          <div class="text">{{ secret.content }}</div>
          <div class="divider"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { useMessagesStore } from '@/stores/messages'

const userStore = useUserStore()
const router = useRouter()
const messagesStore = useMessagesStore()

const allMessages = ref([])
const replyMessages = ref([])
const atMessages = ref([])
const likeMessages = ref([])
const privateMessages = ref([])
const currentTab = ref('all') 

// 获取全部消息
const fetchAllMessages = async () => {
  try {
    allMessages.value = messagesStore.fetchAllMessages()
  } catch (error) {
    console.error('获取全部消息失败:', error)
    showToast('获取全部消息失败')
  }
}

// 获取回复消息
const fetchReplyMessages = async () => {
  try {
    replyMessages.value = messagesStore.fetchReplyMessages()
  } catch (error) {
    console.error('获取回复消息失败:', error)
    showToast('获取回复消息失败')
  }
}

// 切换到回复消息
const showReplyMessages = async () => {
  if (currentTab.value === 'reply') {
    currentTab.value = 'all'
  } else {
    currentTab.value = 'reply'
    if (replyMessages.value.length === 0) {
      await fetchReplyMessages()
    }
  }
}

// 获取 @ 消息
const fetchAtMessages = async () => {
  try {
    atMessages.value = await messagesStore.fetchAtMessages() // 从 store 获取 @ 消息
  } catch (error) {
    console.error('获取 @ 消息失败:', error)
    showToast('获取 @ 消息失败')
  }
}

// 切换到 @ 消息
const showAtMessages = async () => {
  if (currentTab.value === 'at') {
    currentTab.value = 'all'
  } else {
    currentTab.value = 'at'
    if (atMessages.value.length === 0) {
      await fetchAtMessages() // 获取 @ 消息
    }
  }
}

// 获取点赞消息
const fetchLikeMessages = async () => {
  try {
    likeMessages.value = await messagesStore.fetchLikeMessages() // 从 store 获取点赞消息
  } catch (error) {
    console.error('获取点赞消息失败:', error)
    showToast('获取点赞消息失败')
  }
}

// 切换到点赞消息
const showLikeMessages = async () => {
  if (currentTab.value === 'like') {
    currentTab.value = 'all'
  } else {
    currentTab.value = 'like'
    if (likeMessages.value.length === 0) {
      await fetchLikeMessages() 
    }
  }
}

// 获取私信列表
const fetchPrivateMessages = async () => {
  try {
    privateMessages.value = await messagesStore.fetchPrivateMessages()
  } catch (error) {
    console.error('获取私信消息失败:', error)
    showToast('获取私信消息失败')
  }
}

// 切换到私信界面
const showPrivateMessages = async () => {
  if (currentTab.value === 'private') {
    currentTab.value = 'all'
  } else {
    currentTab.value = 'private'
    if (privateMessages.value.length === 0) {
      await fetchPrivateMessages() 
    }
  }
}

// 跳转到私信详情页面
const goToDetail = (id) => {
  console.log('Navigating to detail for ID:', id);
  router.push({ name: 'privateMessageDetail', params: { id } });
};

const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

// 在组件挂载时获取回复消息
onMounted(() => {
  fetchAllMessages();
});
</script>

<style scoped>
.message-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}

.title-header {
  padding: 20px;
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 24px;
  font-weight: 600;
}

.message-nav {
  display: flex; 
  justify-content: space-around; 
  padding: 10px 10px;
  background: #fff; 
  margin-bottom: 10px; 
}

.nav-item {
  display: flex;
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer;
  transition: transform 0.2s;
  flex: 1;
}

.nav-item:hover {
  transform: scale(1.05); 
}

.nav-icon {
  width: 45px; 
  height: 45px; 
  background: #f0f0f0; 
  border-radius: 12px;
  display: flex;
  align-items: center; 
  justify-content: center; 
}

.nav-icon img {
  max-width: 80%; 
  max-height: 80%; 
}

.nav-text {
  font-size: 12px; 
  color: #666; 
  text-align: center; 
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 5px;
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
  font-size: 16px;
  font-weight: 550;
  color: #201f1f;
}

.time {
  font-size: 12px;
  color: #999;
}

.message-text {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-left: 5px;
}

.list {
  background: #fff;
}

.item {
  display: flex;
  padding: 13px;
}

.content {
  flex: 1;
  margin-left: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.text {
  font-size: 14px;
  color: #333;
  margin-bottom:10px;
}

.source-content {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
}

.source-type {
  color: #999;
  margin-right: 4px;
}

.source-text {
  color: #666;
}

.divider {
  height: 1px; 
  background-color: #dcd8d8; 
  margin-top: 8px; 
}

.item:last-child .divider {
  display: none; 
}

</style>
