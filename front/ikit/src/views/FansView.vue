<template>
  <div class="fans-page">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">粉丝</div>
    </div>

    <div class="fans-list">
      <div v-for="fan in fans" :key="fan.id" class="fan-item">
        <div class="fan-avatar">
          <img :src="fan.avatar" @error="handleImageError" />
        </div>
        <div class="fan-info">
          <div class="fan-name">{{ fan.username }}</div>
          <div class="fan-tags">
            <span v-for="tag in fan.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="fan-desc">{{ fan.description }}</div>
        </div>
        <div class="follow-btn" :class="{ active: fan.isFollowed }" @click="handleFollow(fan)">
          {{ fan.isFollowed ? '互相关注' : '关注' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFansStore } from '@/stores/fans'
import { showToast } from 'vant'

const router = useRouter()
const fansStore = useFansStore()
const fans = ref([])

const handleImageError = (e) => {
  e.target.src = '/src/assets/default-avatar.jpg'
}

const handleFollow = async (fan) => {
  try {
    if (fan.isFollowed) {
      await fansStore.unfollowUser(fan.id)
      fan.isFollowed = false
    } else {
      await fansStore.followUser(fan.id)
      fan.isFollowed = true
    }
    showToast(fan.isFollowed ? '关注成功' : '取消关注')
  } catch (error) {
    showToast('操作失败，请重试')
  }
}

onMounted(async () => {
  try {
    console.log('开始获取粉丝列表...')
    await fansStore.fetchFans()
    console.log('获取到的粉丝列表:', fansStore.fans)
    fans.value = fansStore.fans
  } catch (error) {
    console.error('获取粉丝列表失败:', error)
    showToast('获取粉丝列表失败')
  }
})
</script>

<style scoped>
.fans-page {
  min-height: 100vh;
  background: #fff;
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
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  z-index: 100;
}

.back-icon {
  font-size: 18px;
  padding: 8px;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.fans-list {
  padding: 16px;
}

.fan-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.fan-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.fan-info {
  flex: 1;
}

.fan-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.fan-tags {
  margin-bottom: 4px;
}

.tag {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
}

.fan-desc {
  font-size: 12px;
  color: #999;
}

.follow-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid #666;
  color: #666;
}

.follow-btn.active {
  background: #f5f5f5;
  border-color: transparent;
}
</style> 