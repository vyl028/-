<template>
  <div class="collection-page">
    <div class="header">
      <div class="back-icon" @click="router.back()">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <div class="title">我的收藏</div>
    </div>

    <div class="collection-list" v-if="!loading">
      <template v-if="collections.length > 0">
        <div v-for="item in collections" 
             :key="item.id" 
             class="collection-item"
             @click="handleCollectionClick(item)">
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-excerpt">{{ item.content }}</div>
            <div class="item-footer">
              <div class="item-info">
                <span class="author">{{ item.author }}</span>
                <span class="date">{{ item.date }}</span>
              </div>
              <div class="uncollect-btn" @click.stop="handleUncollect($event, item)">
                取消收藏
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-text">还没有收藏内容</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionStore } from '../stores/collection'
import { showToast } from 'vant'
import { useLikeStore } from '../stores/like'

const router = useRouter()
const collectionStore = useCollectionStore()
const likeStore = useLikeStore()
const collections = ref([])
const loading = ref(false)

// 获取收藏列表
const fetchCollections = () => {
  try {
    loading.value = true
    // 获取完整的收藏列表
    const collectionList = collectionStore.fetchCollections()
    
    // 确保每个收藏项都有必要的字段
    collections.value = collectionList.map(item => ({
      id: item.id,
      title: item.title || '',
      content: item.content || '',
      author: item.author || item.username || '',
      date: item.date || new Date().toLocaleDateString(),
      images: item.images || [],
      tags: item.tags || [],
      likeCount: likeStore.getLikeCount(item.id),
      isLiked: likeStore.isPostLiked(item.id),
      collectCount: collectionStore.getCollectionCount(item.id),
      isCollected: true
    }))
  } catch (error) {
    console.error('Error:', error)
    showToast('获取收藏列表失败')
  } finally {
    loading.value = false
  }
}

// 处理取消收藏
const handleUncollect = async (event, item) => {
  event.stopPropagation()
  try {
    await collectionStore.toggleCollection(item)
    collections.value = collectionStore.fetchCollections()
    showToast('已取消收藏')
  } catch (error) {
    console.error('取消收藏失败:', error)
    showToast('操作失败，请重试')
  }
}

// 处理点击收藏项
const handleCollectionClick = (item) => {
  router.push({
    name: 'DynamicDetail',
    params: { id: item.id.toString() },
    state: { post: item }
  })
}

onMounted(() => {
  fetchCollections()
})

// 添加监听器以实时更新收藏列表
watch(
  () => collectionStore.collections,
  () => {
    fetchCollections()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.collection-page {
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
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
  border-bottom: none;
}

.back-icon {
  padding: 8px;
  margin-right: 8px;
  cursor: pointer;
  color: #333;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.collection-list {
  padding: 12px;
}

.collection-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.item-content {
  padding: 16px;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
}

.item-excerpt {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.item-info {
  display: flex;
  gap: 12px;
}

.uncollect-btn {
  color: #FF69B4;
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
}
</style> 