<template>
  <div class="post-edit-page">
    <div class="header">
      <div class="left">
        <span class="back" @click="handleBack">✕</span>
      </div>
      <div class="center">动态</div>
      <div class="right">
        <button class="publish-btn" @click="handlePublish">发布</button>
      </div>
    </div>

    <div class="content">
      <div class="input-box">
        <textarea 
          class="content-input" 
          v-model="postData.content"
          placeholder="随便说说-分享你的心情~"
        />
      </div>
      
      <div class="image-upload">
        <div class="upload-btn">
          <span class="plus">+</span>
        </div>
      </div>
      
      <div class="bottom-tools">
        <div class="tool-item" @click="handleSelectTopic">
          <span class="icon">💭</span>
          <span class="text">选择话题</span>
          <span class="arrow">></span>
        </div>
        <div class="tool-item" @click="handleTopLevel">
          <span class="icon">#</span>
          <span class="text">顶级</span>
          <span class="arrow">></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { usePostStore } from '@/stores/posts'

const router = useRouter()
const postStore = usePostStore()

const postData = ref({
  content: '',
  images: [],
  topic: '',
  topLevel: false
})

const handleBack = () => {
  router.back()
}

const handlePublish = async () => {
  if (!postData.value.content.trim()) {
    showToast('请输入内容')
    return
  }

  try {
    await postStore.createPost(postData.value)
    showToast('发布成功')
    router.push('/home')
  } catch (error) {
    showToast('发布失败，请重试')
  }
}

const handleSelectTopic = () => {
  showToast('话题选择功能开发中...')
}

const handleTopLevel = () => {
  showToast('顶级功能开发中...')
}
</script>

<style scoped>
.post-edit-page {
  min-height: 100vh;
  background: #fff;
  position: relative;
}

.post-edit-page .header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.post-edit-page .left .back {
  font-size: 18px;
  color: #333;
  padding: 8px;
}

.post-edit-page .center {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.post-edit-page .publish-btn {
  background: #a7d4f5;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
}

.post-edit-page .content {
  padding: 16px;
}

.post-edit-page .input-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 12px;
  min-height: 200px;
}

.post-edit-page .content-input {
  width: 100%;
  min-height: 180px;
  border: none;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  color: #333;
}

.post-edit-page .image-upload {
  margin: 16px 0;
}

.post-edit-page .upload-btn {
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
}

.post-edit-page .plus {
  font-size: 24px;
  color: #999;
}

.post-edit-page .bottom-tools {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.post-edit-page .tool-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.post-edit-page .tool-item:last-child {
  border-bottom: none;
}

.post-edit-page .tool-item .icon {
  margin-right: 12px;
  font-size: 16px;
}

.post-edit-page .tool-item .text {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.post-edit-page .tool-item .arrow {
  color: #999;
  font-size: 14px;
}

.post-edit-page ::-webkit-input-placeholder {
  color: #999;
}

.post-edit-page .tool-item:active {
  background-color: #f5f5f5;
}

.post-edit-page .publish-btn:active {
  opacity: 0.8;
}
</style>
