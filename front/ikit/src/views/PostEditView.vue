<template>
  <div class="post-edit-page">
    <div class="header">
      <div class="left">
        <span class="back" @click="handleBack">✕</span>
      </div>
      <div class="center">发布动态</div>
      <div class="right">
        <button class="publish-btn" 
                @click="handlePublish" 
                :disabled="loading || !isFormValid">
          {{ loading ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>

    <div class="content">
      <!-- 标题输入 -->
      <div class="input-box">
        <input 
          v-model="postData.posttitle" 
          class="title-input"
          placeholder="请输入标题"
          maxlength="100"
        />
        <textarea 
          v-model="postData.postcontent" 
          class="content-input"
          placeholder="分享你的想法..."
          maxlength="1000"
        />
      </div>
      
      <!-- 图片上传 -->
      <div class="image-upload">
        <input 
          type="file" 
          ref="fileInput" 
          accept="image/*"
          style="display: none"
          @change="onFileSelected"
        />
        <div v-if="!previewUrl" 
             class="upload-btn" 
             @click="triggerFileInput">
          <span class="plus">+</span>
          <span class="upload-text">上传图片</span>
        </div>
        <div v-else class="image-preview">
          <img :src="previewUrl" alt="预览图" />
          <span class="delete-btn" @click="removeImage">×</span>
        </div>
      </div>

      <!-- 标签输入 -->
      <div class="tags-section">
        <div class="tags-list">
          <span v-for="(tag, index) in tags" 
                :key="index" 
                class="tag">
            {{ tag }}
            <span class="delete-tag" 
                  @click="removeTag(index)">×</span>
          </span>
        </div>
        <div class="tag-input-wrapper">
          <input 
            v-model="newTag"
            @keyup.enter="addTag"
            placeholder="添加标签（最多5个）"
            class="tag-input"
            :disabled="tags.length >= 5"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { usePostStore } from '@/stores/posts'

const router = useRouter()
const postStore = usePostStore()
const loading = ref(false)
const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const newTag = ref('')
const tags = ref(['默认标签'])

const postData = ref({
  posttitle: '',
  postcontent: '',
  postimages: '[]',
  posttags: JSON.stringify(['默认标签'])
})

// 表单验证
const isFormValid = computed(() => {
  return postData.value.posttitle.trim() && 
         postData.value.postcontent.trim() && 
         selectedFile.value
})

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件选择
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

  // 转换为 base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64String = e.target.result
    selectedFile.value = file
    previewUrl.value = base64String
    // 直接存储为 JSON 字符串格式的数组
    postData.value.postimages = JSON.stringify([base64String])
  }
  reader.readAsDataURL(file)
}

// 删除图片
const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  postData.value.postimages = []
}

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && tags.value.length < 5 && !tags.value.includes(tag)) {
    tags.value.push(tag)
    postData.value.posttags = JSON.stringify(tags.value)
    newTag.value = ''
  }
}

// 删除标签
const removeTag = (index) => {
  tags.value.splice(index, 1)
  postData.value.posttags = JSON.stringify(tags.value)
}

// 返回上一页
const handleBack = () => {
  router.back()
}

// 添加初始化检查
onMounted(() => {
  console.log('组件挂载完成')
  console.log('postStore 状态:', {
    isInitialized: !!postStore,
    hasCreateMethod: typeof postStore?.createPost === 'function'
  })
})

const handlePublish = async () => {
  console.log('=== 开始发布流程 ===')
  
  try {
    if (!postStore) {
      throw new Error('postStore 未初始化')
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo?.userid) {
      throw new Error('请先登录')
    }

    const postDataToSend = {
      posttitle: postData.value.posttitle.trim(),
      postcontent: postData.value.postcontent.trim(),
      postimages: postData.value.postimages,
      posttags: JSON.stringify(tags.value),
      authorid: Number(userInfo.userid)
    }
    
    console.log('准备发送的数据:', postDataToSend)
    loading.value = true

    const result = await postStore.createPost(postDataToSend)
    console.log('发布成功:', result)
    showToast('发布成功')
    router.push('/home')

  } catch (error) {
    console.error('发布失败:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    showToast(error.response?.data?.message || error.message || '发布失败，请重试')
  } finally {
    loading.value = false
  }
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
