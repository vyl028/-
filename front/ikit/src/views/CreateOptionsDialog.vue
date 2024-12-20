<template>
  <div class="create-options-dialog" v-if="show">
    <div class="dialog-overlay" @click="onClose"></div>
    <div class="dialog-content">
      <div class="options-container">
        <div class="option-item" @click="handleOptionClick('post')">
          <div class="icon-wrapper">
            <img src="@/assets/logo/edit-3.svg" alt="发帖" class="option-icon">
          </div>
          <span class="option-text">发帖</span>
        </div>
        <div class="option-item" @click="handleOptionClick('article')">
          <div class="icon-wrapper">
            <img src="@/assets/logo/edit.svg" alt="写文章" class="option-icon">
          </div>
          <span class="option-text">写文章</span>
        </div>
      </div>
      <div class="close-button" @click="onClose"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'select'])

const onClose = () => {
  emit('close')
}

const handleOptionClick = (type) => {
  emit('select', type)
  emit('close')
  
  if (type === 'article') {
    router.push('/article/edit')
  } else if (type === 'post') {
    router.push('/post/edit')
  }
}
</script>

<style scoped>
/* 弹窗基础样式 */
/* 修改弹窗基础样式 */
.create-options-dialog {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  max-width: 600px;
}

/* 修改媒体查询 */
@media screen and (min-width: 600px) {
  .create-options-dialog {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
  }
  
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

/* 内容区域 - 优化圆角和阴影 */
.dialog-content {
  position: relative;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
}

/* 选项容器 */
.options-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
  margin: 10px 20px 30px;
  padding: 0 20px;
}

/* 选项容器 */
.options-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
  margin: 10px 20px 30px;
  padding: 0 20px;
}

/* 选项容器 */
.options-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
  margin: 10px 20px 30px;
  padding: 0 20px;
}

/* 选项样式 */
.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px 16px;    /* 稍微减小内边距 */
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 选项悬停效果 - 使用更柔和的粉色 */
.option-item:hover {
  transform: translateY(-2px);
  background:#feabd5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 选项点击效果 */
.option-item:active {
  transform: translateY(0);
  background: #FFE6F4;
  border-color: #000000;
}

/* 默认文字样式 */
.option-text {
  font-size: 15px;
  color: #333;          /* 默认文字颜色 - 深灰色 */
  font-weight: 500;
  margin-top: 8px;
}

/* 选项悬停时文字颜色 */
.option-item:hover .option-text {
  color: #FFFFFF;       /* 悬停时文字颜色 - 白色 */
}

/* 选项点击时文字颜色 */
.option-item:active .option-text {
  color: #333;          /* 点击时文字颜色 - 回到深灰色 */
}

/* 图标容器 */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

/* 图标样式 */
.option-icon {
  width: 28px;
  height: 28px;
  transition: all 0.3s ease;
}

/* 图标悬停效果 */
.option-item:hover .option-icon {
  transform: scale(1.1);
}

/* 文字样式 */
.option-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 关闭按钮 */
.close-button {
  width: 40px;
  height: 40px;
  background: #FF69B4;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  position: relative;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(45deg);
}

/* 关闭按钮内部十字 */
.close-button::before,
.close-button::after {
  content: '';
  position: absolute;
  background-color: #FFFFFF;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
}

.close-button::before {
  width: 3px;
  height: 18px;
}

.close-button::after {
  width: 18px;
  height: 3px;
}

/* 关闭按钮悬停效果 */
.close-button:hover {
  transform: rotate(0deg);
  box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
}

@media screen and (min-width: 600px) {
  .create-options-dialog {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
