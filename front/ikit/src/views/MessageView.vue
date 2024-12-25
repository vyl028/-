<template>
  <div class="message-container">
    <div class="header">
      <h1>消息</h1>
    </div>

    <!-- 消息类型导航 -->
    <div class="message-nav">
      <div class="nav-item" @click="showReplyMessages">
        <div class="nav-icon">💬</div>
        <div class="nav-text">回复我的</div>
      </div>
      <div class="nav-item" @click="showAtMessages">
        <div class="nav-icon">@</div>
        <div class="nav-text">@我</div>
      </div>
      <div class="nav-item" @click="showLikeMessages">
        <div class="nav-icon">👍</div>
        <div class="nav-text">收到的赞</div>
      </div>
      <div class="nav-item" @click="showPrivateMessages">
        <div class="nav-icon">✉️</div>
        <div class="nav-text">私信</div>
      </div>
    </div>

    <!-- 回复消息列表 -->
    <div v-if="currentTab === 'reply'" class="reply-list">
      <div 
        v-for="reply in replyMessages" 
        :key="reply.id"
        class="reply-item"
      >
        <img 
          :src="reply.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="reply-content">
          <div class="reply-header">
            <span class="username">{{ reply.username }}</span>
            <span class="time">{{ reply.time }}</span>
          </div>
          <div class="reply-text">{{ reply.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ reply.sourceType }}:</span>
            <span class="source-text">{{ reply.sourceContent }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- @消息列表 -->
    <div v-if="currentTab === 'at'" class="at-list">
      <div 
        v-for="at in atMessages" 
        :key="at.id"
        class="at-item"
      >
        <img 
          :src="at.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="at-content">
          <div class="at-header">
            <span class="username">{{ at.username }}</span>
            <span class="time">{{ at.time }}</span>
          </div>
          <div class="at-text">{{ at.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ at.sourceType }}:</span>
            <span class="source-text">{{ at.sourceContent }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部消息列表 -->
    <div v-if="currentTab === 'all'" class="message-list">
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

    <!-- 点赞消息列表 -->
    <div v-if="currentTab === 'like'" class="like-list">
      <div 
        v-for="like in likeMessages" 
        :key="like.id"
        class="like-item"
      >
        <img 
          :src="like.avatar" 
          class="avatar"
          @error="handleAvatarError"
        />
        <div class="like-content">
          <div class="like-header">
            <span class="username">{{ like.username }}</span>
            <span class="time">{{ like.time }}</span>
          </div>
          <div class="like-text">{{ like.content }}</div>
          <div class="source-content">
            <span class="source-type">{{ like.sourceType }}:</span>
            <span class="source-text">{{ like.sourceContent }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 私信界面 -->
    <div v-if="currentTab === 'private'" class="private-message">
      <!-- 联系人横向列表 -->
      <div class="contacts-horizontal">
        <div 
          v-for="contact in contacts" 
          :key="contact.id"
          class="contact-card"
          :class="{ active: currentContact?.id === contact.id }"
          @click="selectContact(contact)"
        >
          <img 
            :src="contact.avatar" 
            class="avatar"
            @error="handleAvatarError"
          />
          <div class="contact-name">{{ contact.username }}</div>
          <div v-if="contact.unread" class="unread-badge">{{ contact.unread }}</div>
        </div>
      </div>

      <!-- 聊天窗口 -->
      <div class="chat-container">
        <div class="chat-window" v-if="currentContact">
          <div class="chat-header">
            <span class="chat-title">{{ currentContact.username }}</span>
          </div>
          <div class="chat-messages">
            <div 
              v-for="message in chatMessages" 
              :key="message.id"
              :class="['message', message.isSelf ? 'self' : 'other']"
            >
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
          <div class="chat-input">
            <input 
              v-model="messageText" 
              @keyup.enter="sendMessage"
              placeholder="发送消息..."
            />
            <button @click="sendMessage">发送</button>
          </div>
        </div>
        <div v-else class="empty-chat">
          <div class="empty-text">选择一个联系人开始聊天</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { getMessageList, getReplyMessages, getAtMessages, getLikeMessages, getPrivateContacts, getChatMessages } from '@/api/message'

const userStore = useUserStore()
const messages = ref([])
const replyMessages = ref([])
const atMessages = ref([])
const likeMessages = ref([])
const currentTab = ref('all') // 'all', 'reply', 'at', 'like'
const contacts = ref([])
const currentContact = ref(null)
const chatMessages = ref([])
const messageText = ref('')

// 获取回复消息
const fetchReplyMessages = async () => {
  try {
    replyMessages.value = await getReplyMessages()
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

// 切换回全部消息
const showAllMessages = () => {
  currentTab.value = 'all'
}

// 获取@消息
const fetchAtMessages = async () => {
  try {
    atMessages.value = await getAtMessages()
  } catch (error) {
    console.error('获取@消息失败:', error)
    showToast('获取@消息失败')
  }
}

// 显示@消息
const showAtMessages = async () => {
  if (currentTab.value === 'at') {
    currentTab.value = 'all'
  } else {
    currentTab.value = 'at'
    if (atMessages.value.length === 0) {
      await fetchAtMessages()
    }
  }
}

// 获取点赞消息
const fetchLikeMessages = async () => {
  try {
    likeMessages.value = await getLikeMessages()
  } catch (error) {
    console.error('获取点赞消息失败:', error)
    showToast('获取点赞消息失败')
  }
}

// 显示点赞消息
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

// 获取私信联系人列表
const fetchContacts = async () => {
  try {
    contacts.value = await getPrivateContacts()
  } catch (error) {
    console.error('获取联系人列表失败:', error)
    showToast('获取联系人失败')
  }
}

// 获取聊天记录
const fetchChatMessages = async (contactId) => {
  try {
    chatMessages.value = await getChatMessages(contactId)
  } catch (error) {
    console.error('获取聊天记录失败:', error)
    showToast('获取聊天记录失败')
  }
}

// 选择联系人
const selectContact = async (contact) => {
  currentContact.value = contact
  await fetchChatMessages(contact.id)
}

// 显示私信界面
const showPrivateMessages = async () => {
  currentTab.value = 'private'
  if (contacts.value.length === 0) {
    await fetchContacts()
  }
}

// 发送消息
const sendMessage = () => {
  if (!messageText.value.trim()) return
  
  chatMessages.value.push({
    id: Date.now(),
    senderId: 'self',
    content: messageText.value,
    time: '刚刚',
    isSelf: true
  })
  
  messageText.value = ''
}

const handleAvatarError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

onMounted(async () => {
  messages.value = await getMessageList()
})
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

.reply-list {
  background: #fff;
}

.reply-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.reply-content {
  flex: 1;
  margin-left: 12px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.reply-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.source-content {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
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

.time {
  font-size: 12px;
  color: #999;
}

.at-list {
  background: #fff;
}

.at-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.at-content {
  flex: 1;
  margin-left: 12px;
}

.at-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.at-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.like-list {
  background: #fff;
}

.like-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.like-content {
  flex: 1;
  margin-left: 12px;
}

.like-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.like-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.private-message {
  display: flex;
  flex-direction: column;
  background: #fff;
}

.contacts-horizontal {
  display: flex;
  overflow-x: auto;
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
  gap: 15px;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  min-width: 60px;
}

.contact-card .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 8px;
}

.contact-card .contact-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.contact-card.active .avatar {
  border: 2px solid #007fff;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 230px);
}

.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.message {
  margin-bottom: 15px;
}

.message.self {
  text-align: right;
}

.message-content {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 4px;
  background: #f5f5f5;
  max-width: 70%;
}

.message.self .message-content {
  background: #007fff;
  color: #fff;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 20px;
  background: #007fff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
