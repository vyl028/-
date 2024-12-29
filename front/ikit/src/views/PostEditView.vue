<template>
  <div class="post-edit-page">
    <div class="header">
      <div class="left">
        <span class="back" @click="handleBack">✕</span>
      </div>
      <div class="center">动态</div>
      <div class="right">
        <button class="publish-btn" @click="handlePublish" :disabled="loading">
          {{ loading ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>

    <div class="content">
      <div class="input-box">
        <input 
          v-model="postData.posttitle" 
          class="title-input"
          placeholder="请输入标题"
        />
        <textarea 
          class="content-input" 
          v-model="postData.postcontent"
          placeholder="随便说说-分享你的心情~"
        />
      </div>
      
      <div class="image-upload">
        <input 
          type="file" 
          ref="fileInput" 
          accept="image/*" 
          style="display: none" 
          @change="onFileSelected"
        />
        <div class="upload-btn" @click="triggerFileInput">
          <span class="plus">+</span>
        </div>
        <div v-if="selectedFile" class="image-preview">
          <img :src="previewUrl" alt="预览图" />
          <span class="delete-btn" @click="removeImage">×</span>
        </div>
      </div>

      <div class="tags-input">
        <div class="tags-list">
          <span v-for="(tag, index) in tags" :key="index" class="tag">
            {{ tag }}
            <span class="delete-tag" @click="removeTag(index)">×</span>
          </span>
        </div>
        <input 
          v-model="newTag"
          @keyup.enter="addTag"
          placeholder="输入标签后按回车添加"
          class="tag-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { createPost } from '@/api/posts'

const router = useRouter()
const loading = ref(false)
const fileInput = ref(null)
const previewUrl = ref('')
const selectedFile = ref(null)
const newTag = ref('')
const tags = ref(['默认标签'])  // 初始标签

const postData = ref({
  posttitle: '',
  postcontent: '',
  postimages: '[]',
  posttags: '["默认标签"]'  // 修改初始值为JSON字符串
})

// 检查用户是否已登录
onMounted(() => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  
  console.log('当前登录信息:', {
    token: token ? token.substring(0, 10) + '...' : null,
    userInfo
  })
  
  if (!token || !userInfo.userid) {  // 改为检查 userid
    showToast('请先登录')
    router.push('/login?redirect=/post/edit')
    return
  }
})

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    if (tags.value.length >= 5) {
      showToast('最多添加5个标签')
      return
    }
    tags.value.push(tag)
    newTag.value = ''
    // 直接将数组转换为JSON字符串
    postData.value.posttags = JSON.stringify(tags.value)
  }
}

// 删除标签
const removeTag = (index) => {
  tags.value.splice(index, 1)
  postData.value.posttags = JSON.stringify(tags.value)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过 5MB')
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  fileInput.value.value = ''
  postData.value.postimages = '[]'
}

const handlePublish = async () => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  
  console.log('发布时的用户信息:', userInfo)
  
  if (!token || !userInfo.userid) {  // 检查 userid
    showToast('请先登录')
    router.push('/login')
    return
  }

  if (!postData.value.posttitle.trim()) {
    showToast('请输入标题')
    return
  }
  
  if (!postData.value.postcontent.trim()) {
    showToast('请输入内容')
    return
  }

  if (!selectedFile.value) {
    showToast('请选择图片')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('posttitle', postData.value.posttitle.trim())
    formData.append('postcontent', postData.value.postcontent.trim())
    formData.append('imageName', selectedFile.value.name)
    formData.append('posttags', tags.value.join(','))
    formData.append('authorid', userInfo.userid)  // 使用 userid

    console.log('准备发送的数据:', {
      posttitle: formData.get('posttitle'),
      postcontent: formData.get('postcontent'),
      imageName: formData.get('imageName'),
      posttags: formData.get('posttags'),
      authorid: formData.get('authorid'),
      userInfo: userInfo
    })

    const response = await createPost(formData)
    console.log('服务器响应：', response)
    showToast('发布成功')
    router.push('/home')
  } catch (error) {
    console.error('发布失败:', error.response?.data || error.message)
    showToast(error.response?.data?.message || error.message || '发布失败')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.3s;
}

.upload-btn:hover {
  border-color: #a7d4f5;
  background: #f0f9ff;
}

.plus {
  font-size: 24px;
  color: #999;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: rgba(0,0,0,0.7);
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

.title-input {
  width: 100%;
  border: none;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  outline: none;
}

.tags-input {
  margin-top: 16px;
  padding: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #e8f4ff;
  color: #007AFF;
  border-radius: 4px;
  font-size: 12px;
}

.delete-tag {
  margin-left: 4px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.tag-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.tag-input:focus {
  border-color: #007AFF;
}
</style>
