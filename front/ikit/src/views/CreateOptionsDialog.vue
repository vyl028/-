<template>
  <div class="create-options-dialog" v-if="show">
    <div class="dialog-overlay" @click="onClose"></div>
    <div class="dialog-content">
      <div class="options-container">
        <div class="option-item" @click="handleOptionClick('post')">
          <div class="icon-wrapper">
            <span class="option-icon">✏️</span>
          </div>
          <span class="option-text">发帖</span>
        </div>
        <div class="option-item" @click="handleOptionClick('article')">
          <div class="icon-wrapper">
            <span class="option-icon">📝</span>
          </div>
          <span class="option-text">写文章</span>
        </div>
      </div>
      <div class="close-button" @click="onClose">
        <span>✕</span>
      </div>
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
.create-options-dialog {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  max-width: 600px;
  margin: 0 auto;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.dialog-content {
  position: relative;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.options-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
  margin-bottom: 20px;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;
  cursor: pointer;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.option-icon {
  font-size: 24px;
}

.option-text {
  font-size: 14px;
  color: #333;
}

.close-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 20px;
}

.close-button span {
  font-size: 18px;
}
</style>