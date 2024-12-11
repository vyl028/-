<template>
  <div class="article-edit">
    <div class="header">
      <div class="left">
        <span class="back" @click="handleBack">✕</span>
      </div>
      <div class="center">写文章</div>
      <div class="right">
        <button class="publish-btn">发布</button>
      </div>
    </div>

    <div class="content">
      <div class="input-box">
        <input 
          type="text" 
          class="title-input" 
          v-model="articleData.title"
          placeholder="请输入标题"
        />
      </div>
      <div class="input-box">
        <textarea 
          class="content-input" 
          v-model="articleData.content"
          placeholder="请输入正文"
        />
      </div>
      
      <div class="bottom-tools">
        <div class="tool-item">
          <span class="icon">💭</span>
          <span class="text">选择话题</span>
          <span class="arrow">></span>
        </div>
        <div class="tool-item">
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
import { useArticleStore } from '@/stores/article'

const router = useRouter()
const articleStore = useArticleStore()

const articleData = ref({
  title: '',
  content: '',
  topic: '',
  topLevel: false
})

const handleBack = () => {
  router.back()
}

const handlePublish = async () => {
  if (!articleData.value.title.trim()) {
    showToast('请输入标题')
    return
  }
  if (!articleData.value.content.trim()) {
    showToast('请输入正文')
    return
  }

  try {
    await articleStore.createArticle(articleData.value)
    showToast('发布成功')
    router.push('/home')
  } catch (error) {
    showToast('发布失败，请重试')
  }
}

const handleSelectTopic = () => {
  // TODO: 实现话题选择功能
  showToast('话题选择功能开发中...')
}

const handleTopLevel = () => {
  // TODO: 实现顶级功能
  showToast('顶级功能开发中...')
}
</script>

<style scoped>
.article-edit {
  min-height: 100vh;
  background: #fff;
}

.header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.left .back {
  font-size: 18px;
  color: #333;
}

.center {
  font-size: 16px;
  font-weight: 500;
}

.publish-btn {
  background: #a7d4f5;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
}

.content {
  padding: 16px;
}

.input-box {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 12px;
}

.title-input {
  width: 100%;
  border: none;
  font-size: 16px;
  outline: none;
}

.content-input {
  width: 100%;
  height: 200px;
  border: none;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.bottom-tools {
  margin-top: 20px;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.tool-item .icon {
  margin-right: 8px;
  font-size: 16px;
}

.tool-item .text {
  flex: 1;
  color: #666;
  font-size: 14px;
}

.tool-item .arrow {
  color: #999;
}

/* 添加输入框的占位符样式 */
::-webkit-input-placeholder {
  color: #999;
}
</style>
