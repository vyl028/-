<template>
  <div class="post-edit">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="发布动态"
      left-text="取消"
      right-text="发布"
      @click-left="onCancel"
      @click-right="onSubmit"
    />

    <!-- 主体内容 -->
    <div class="post-content">
      <!-- 标题输入框 -->
      <van-field
        v-model="postData.title"
        placeholder="标题(选填)"
        maxlength="50"
        class="title-input"
      />

      <!-- 内容输入框 -->
      <van-field
        v-model="postData.content"
        type="textarea"
        placeholder="分享你的想法..."
        rows="5"
        maxlength="500"
        class="content-input"
      />

      <!-- 图片上传 -->
      <div class="upload-section">
        <van-uploader
          v-model="postData.images"
          multiple
          :max-count="9"
          :before-read="beforeRead"
          :after-read="afterRead"
        >
          <template #preview-cover="{ file }">
            <div class="preview-cover">
              <van-loading v-if="file.status === 'uploading'" type="spinner" size="20" />
              <van-icon v-if="file.status === 'failed'" name="close" style="color: #ee0a24;" />
            </div>
          </template>
        </van-uploader>
      </div>

      <!-- 标签选择 -->
      <div class="tags-section">
        <van-field
          readonly
          label="话题"
          :value="selectedTags"
          placeholder="选择话题"
          @click="showTagPicker = true"
        />
      </div>
    </div>

    <!-- 标签选择弹窗 -->
    <van-popup v-model:show="showTagPicker" position="bottom">
      <van-picker
        :columns="availableTags"
        @confirm="onTagsConfirm"
        @cancel="showTagPicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 加载状态 -->
    <van-overlay :show="isSubmitting" z-index="9999">
      <div class="loading-wrapper">
        <van-loading type="spinner" color="#1989fa" size="24px">发布中...</van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { usePostStore } from '@/stores/posts'

const router = useRouter()
const postStore = usePostStore()

// 状态变量
const isSubmitting = ref(false)
const showTagPicker = ref(false)

// 帖子数据
const postData = ref({
  title: '',
  content: '',
  images: [],
  tags: []
})

// 可选标签列表
const availableTags = ['原神', '崩坏星穹铁道', '绝区零', '其他']

// 已选标签展示
const selectedTags = computed(() => {
  return postData.value.tags.join(', ')
})

// 图片上传前检查
const beforeRead = (file) => {
  // 检查文件类型
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    showToast('请上传 jpg、png 或 gif 格式图片')
    return false
  }
  // 检查文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过 5MB')
    return false
  }
  return true
}

// 图片上传处理
const afterRead = async (file) => {
  file.status = 'uploading'
  file.message = '上传中...'

  try {
    // 这里应该调用实际的图片上传 API
    // const response = await uploadImage(file.file)
    // 模拟上传成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    file.status = 'done'
    file.message = '上传成功'
    // postData.value.images.push(response.data.url)
  } catch (error) {
    file.status = 'failed'
    file.message = '上传失败'
    showToast('图片上传失败')
  }
}

// 处理标签选择
const onTagsConfirm = (values) => {
  postData.value.tags = [values]
  showTagPicker.value = false
}

// 提交表单
const onSubmit = async () => {
  if (!postData.value.content.trim()) {
    showToast('请输入内容')
    return
  }

  try {
    isSubmitting.value = true
    await postStore.createPost({
      title: postData.value.title || '分享动态',
      content: postData.value.content,
      images: postData.value.images.map(img => img.url || img),
      tags: postData.value.tags
    })
    showToast('发布成功')
    router.back()
  } catch (error) {
    showToast('发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 取消发布
const onCancel = async () => {
  if (postData.value.content || postData.value.images.length > 0) {
    try {
      await showConfirmDialog({
        title: '确认取消',
        message: '是否放弃当前编辑的内容？'
      })
      router.back()
    } catch {
      // 用户取消操作，不做任何处理
    }
  } else {
    router.back()
  }
}
</script>

<style scoped>
.post-edit {
  min-height: 100vh;
  background: #fff;
}

.post-content {
  padding: 16px;
}

.title-input {
  margin-bottom: 12px;
}

.content-input {
  margin-bottom: 16px;
}

.upload-section {
  padding: 16px 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}

.tags-section {
  margin-top: 16px;
}

.preview-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>