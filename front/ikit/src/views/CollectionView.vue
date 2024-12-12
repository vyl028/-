<template>
  <div class="collection-page">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">收藏</div>
    </div>

    <div class="collection-list">
      <div v-for="item in collections" :key="item.id" class="collection-item">
        <div class="item-header">
          <h3 class="item-title">{{ item.title }}</h3>
          <span class="item-date">{{ item.date }}</span>
        </div>
        <div class="item-author">
          <span class="author-avatar">👤</span>
          <span class="author-name">{{ item.author }}</span>
        </div>
        <div class="item-content">{{ item.content }}</div>
        <div class="item-image" v-if="item.image">
          <img :src="item.image" alt="" />
        </div>
        <div class="item-stats">
          <span>♥ {{ item.likes }}</span>
          <span>💬 {{ item.comments }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionStore } from '@/stores/collection'
import { showToast } from 'vant'

const router = useRouter()
const collectionStore = useCollectionStore()
const collections = ref([])

console.log('CollectionView mounted')

onMounted(async () => {
  try {
    console.log('Fetching collections...')
    await collectionStore.fetchCollections()
    collections.value = collectionStore.collections
  } catch (error) {
    console.error('Error:', error)
    showToast('获取收藏列表失败')
  }
})
</script>

<style scoped>
.collection-page {
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

.collection-list {
  padding: 16px;
}

.collection-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
}

.item-date {
  font-size: 12px;
  color: #999;
}

.item-author {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.author-avatar {
  margin-right: 8px;
}

.author-name {
  font-size: 14px;
  color: #666;
}

.item-content {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.item-image {
  width: 200px;
  height: 200px;
  margin-bottom: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 12px;
}
</style> 