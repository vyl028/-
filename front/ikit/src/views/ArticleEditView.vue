<template>
  <div class="article-edit">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="left">
        <span class="back" @click="handleBack">×</span>
      </div>
      <div class="center">发文章</div>
      <div class="right">
        <button class="publish-btn" :disabled="!canPublish" @click="handlePublish">
          发布
        </button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="content">
      <!-- 大标题输入框 -->
      <input 
        type="text"
        class="main-title-input"
        v-model="articleData.mainTitle"
        placeholder="请输入大标题"
      />

      <!-- 初始添加按钮组 -->
      <div class="initial-add-btns">
        <button @click="addBlock('subtitle', 0)" class="add-btn">
          添加子标题
        </button>
        <button @click="addBlock('text', 0)" class="add-btn">
          添加正文
        </button>
        <button @click="handleAddImage(0)" class="add-btn">
          添加图片
        </button>
      </div>

      <!-- 内容块列表 -->
      <draggable 
        v-model="articleData.blocks"
        class="blocks-container"
        handle=".drag-handle"
        @end="onBlocksReorder"
        item-key="index"
      >
        <template #item="{element, index}">
          <div class="block-item">
            <!-- 拖拽手柄 -->
            <div class="drag-handle">⋮⋮</div>

            <!-- 小标题块 -->
            <input
              v-if="element.type === 'subtitle'"
              type="text"
              class="subtitle-input"
              v-model="element.content"
              placeholder="请输入小标题"
            />

            <!-- 正文块 -->
            <textarea
              v-if="element.type === 'text'"
              class="text-input"
              v-model="element.content"
              placeholder="请输入正文"
            />

            <!-- 图片块 -->
            <div v-if="element.type === 'image'" class="image-block">
              <img 
                :src="element.content" 
                class="content-image"
                @click="handleImagePreview(element.content)"
              />
              <span class="delete-btn" @click="removeBlock(index)">×</span>
            </div>

            <!-- 添加按钮组 -->
            <div class="add-btns">
              <span @click="addBlock('subtitle', index + 1)" class="add-btn">
                <i class="icon">T</i>小标题
              </span>
              <span @click="addBlock('text', index + 1)" class="add-btn">
                <i class="icon">¶</i>正文
              </span>
              <span @click="handleAddImage(index + 1)" class="add-btn">
                <i class="icon">+</i>图片
              </span>
            </div>
          </div>
        </template>
      </draggable>

      <!-- 底部工具栏 -->
      <div class="toolbar">
        <div class="tool-item" @click="navigateToActivity">
          <span class="tool-icon">📅</span>
          <span class="tool-text">选择活动</span>
          <span class="arrow">></span>
        </div>
        <div class="tool-item" @click="showTagSelector">
          <span class="tool-icon">#</span>
          <span class="tool-text">选择标签</span>
          <span class="arrow">></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showImagePreview } from 'vant'
import draggable from 'vuedraggable'

const router = useRouter()

// 文章数据
const articleData = ref({
  mainTitle: '',
  blocks: []
})

// 图片大小限制 (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// 判断是否可以发布
const canPublish = computed(() => {
  return articleData.value.mainTitle.trim() !== ''
})

// 添加内容块
const addBlock = (type, index) => {
  articleData.value.blocks.splice(index, 0, {
    type,
    content: ''
  })
}

// 处理添加图片
const handleAddImage = (index) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 检查文件大小
      if (file.size > MAX_IMAGE_SIZE) {
        showToast('图片大小不能超过5MB')
        return
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        showToast('请选择图片文件')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        articleData.value.blocks.splice(index, 0, {
          type: 'image',
          content: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }
  
  input.click()
}

// 预览图片
const previewImage = (imageUrl) => {
  showImagePreview({
    images: [imageUrl],
    startPosition: 0,
    closeable: true,
    closeIconPosition: 'top-right'
  })
}

// 获取所有图片URL
const getImageUrls = () => {
  return articleData.value.blocks
    .filter(block => block.type === 'image')
    .map(block => block.content)
}

// 预览当前图片并支持查看所有图片
const handleImagePreview = (currentImage) => {
  const allImages = getImageUrls()
  const startPosition = allImages.indexOf(currentImage)
  
  showImagePreview({
    images: allImages,
    startPosition: startPosition,
    closeable: true,
    closeIconPosition: 'top-right'
  })
}

// 更新内容块顺序
const onBlocksReorder = (evt) => {
  const { oldIndex, newIndex } = evt
  const blocks = [...articleData.value.blocks]
  const movedBlock = blocks.splice(oldIndex, 1)[0]
  blocks.splice(newIndex, 0, movedBlock)
  articleData.value.blocks = blocks
}

// 移除内容块
const removeBlock = (index) => {
  articleData.value.blocks.splice(index, 1)
}

// 返回上一页
const handleBack = () => {
  router.back()
}

// 发布文章
const handlePublish = () => {
  if (!canPublish.value) {
    showToast('请填写文章标题')
    return
  }
  // TODO: 实现发布逻辑
  console.log('发布文章:', articleData.value)
  showToast('发布成功')
  router.back()
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
  background: linear-gradient(to right, #FFE6E6, #E6F2FF);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.back {
  font-size: 24px;
  color: #333;
}

.center {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.publish-btn {
  background: #FF4D4F;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.publish-btn:disabled {
  background: #ccc;
}

.content {
  padding: 16px;
}

.main-title-input {
  width: 100%;
  font-size: 16px;
  border: none;
  outline: none;
  padding: 8px;
  margin-bottom: 20px;
}

.initial-add-btns {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.add-btn {
  background: #FFF0F0;
  color: #FF4D4F;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
}

.toolbar {
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.tool-icon {
  margin-right: 8px;
  font-size: 18px;
}

.tool-text {
  flex: 1;
  color: #666;
  font-size: 14px;
}

.arrow {
  color: #999;
}

.block-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 4px;
  padding: 8px;
  transition: background-color 0.2s;
}

.block-item:hover {
  background: #f9f9f9;
}

.subtitle-input {
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  border: none;
  outline: none;
  padding: 8px;
}

.text-input {
  width: 100%;
  min-height: 100px;
  font-size: 16px;
  line-height: 1.6;
  border: none;
  outline: none;
  padding: 8px;
  resize: none;
}

.image-block {
  position: relative;
  margin: 8px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  cursor: pointer;
  transition: opacity 0.2s;
}

.content-image:hover {
  opacity: 0.9;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-block:hover .delete-btn {
  opacity: 1;
}

.add-btns, .initial-add-btns {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.add-btn:hover {
  background: #e8e8e8;
}

.icon {
  font-style: normal;
  color: #999;
}

/* 添加拖拽相关样式 */
.drag-handle {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  cursor: move;
  color: #999;
  margin-right: 8px;
  user-select: none;
}
</style>
