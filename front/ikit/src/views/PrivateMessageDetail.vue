<template>
    <div class="chat-container">
      <div class="chat-header">
        <div class="left">
          <span class="back" @click="handleBack">
            <img src="@/assets/messages/back.png" alt="返回" />
          </span>
        </div>
        <h2 class="contact-name">{{ contactName }}</h2>
      </div>
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" :class="['message', { 'sent': message.sender === userId, 'received': message.sender !== userId }]">
           {{ message.content }}
        </div>
      </div>
      <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="发个消息聊聊呗~" />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useMessagesStore } from '@/stores/messages';
  
  const router = useRouter();
  const route = useRoute();
  const messagesStore = useMessagesStore();
  
  // 用户信息
  const userId = '千早爱音';
  const contactName = ref('');
  const messages = ref([]);
  const newMessage = ref('');
  const messagesContainer = ref(null);
  
  // 获取聊天记录
  const fetchMessages = () => {
    const chatId = route.params.id; 
    const chatMessages = messagesStore.fetchPrivateMessages().filter(message => message.id === parseInt(chatId));
    messages.value = chatMessages;
  };
  
  const fetchContactName = () => {
    const chatId = route.params.id; 
    const message = messages.value.find((msg) => msg.id === parseInt(chatId));
    contactName.value = message ? message.username : '未知联系人'; // 设置联系人名称
  };
  
  
  // 发送消息
  const sendMessage = () => {
    if (newMessage.value.trim() === '') return;
  
    const message = {
      id: messages.value.length + 1,
      sender: userId,
      content: newMessage.value,
      chatId: route.params.id,
      timestamp: new Date().toLocaleTimeString(),
    };
  
    messages.value.push(message);
    newMessage.value = '';
    scrollToBottom();
  };
  
  // 处理图片上传
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const message = {
        id: messages.value.length + 1,
        sender: userId,
        content: `图片: ${file.name}`,
        chatId: route.params.id,
        timestamp: new Date().toLocaleTimeString(),
        image: URL.createObjectURL(file), // 预览图像
      };
      messages.value.push(message);
      scrollToBottom();
    }
  };
  
  // 滚动到最新消息
  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  };
  
  // 返回上一页
  const handleBack = () => {
    router.go(-1);
  };
  
  // 监听路由变化重新加载聊天记录
  watch(() => route.params.id, async () => {
    await fetchMessages();
    fetchContactName();
  });
  
  // 页面加载时获取聊天记录和联系人信息
  onMounted(async () => {
    await fetchMessages();
    fetchContactName();
  });
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .chat-header {
    padding: 20px;
    background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  
  .left {
    margin-right: 10px;
    cursor: pointer;
  }
  
  .back img {
    width: 24px;
    height: 24px;
  }
  
  .contact-name {
    font-size: 18px;
    font-weight: bold;
    flex: 1;
    text-align: center;
  }
  
  .chat-messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }
  
  .message {
    display: flex;
    margin: 10px 0;
    align-items: flex-start;
  }
  
  .sent {
    background-color: #dcf8c6; 
    align-self: flex-end;
    margin-left: auto; 
    padding: 10px;
    border-radius: 10px;
    max-width: 70%; 
    word-wrap: break-word; 
    width: fit-content;
  }
  
  .received {
    background-color: #fff; 
    align-self: flex-start;
    margin-right: auto;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%; 
    word-wrap: break-word; 
    width: fit-content;
  }
  
  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 10px;
    margin-right: 10px;
  }
  
  .sent-avatar {
    order: 1;
    margin-left: 10px;
    /* 头像在右侧 */
  }
  
  .received-avatar {
    order: -1;
    margin-right: 10px;
    /* 头像在左侧 */
  }
  
  .message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .chat-input {
    height: 60px;
    display: flex;
    padding: 10px;
    border-top: 1px solid #e0e0e0;
  }
  
  .upload-container {
    margin-top: 5px;
    margin-right: 10px;
  }
  
  .upload-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  
  input[type="file"] {
    display: none;
  }
  
  .chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #f4bfe2;
    background-color: #fdfdfd;
    border-radius: 30px;
  }
  
  .chat-input button {
    margin-left: 10px;
    padding: 5px;
    background-color: #df87bf;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
  }
  </style>
  