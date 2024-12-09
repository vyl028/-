<template>
  <div class="post-container">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">发帖</div>
    </div>
    
    <div class="content">
      <!-- 临时占位内容 -->
      <p>发帖功能开发中...</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.post-container {
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

.content {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style> 