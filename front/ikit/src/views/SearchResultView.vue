<template>
  <div class="search-result">
    <div class="header">
      <div class="back-icon" @click="router.back()" tabindex="-1">←</div>
      <div class="search-box">
        <input 
          ref="searchInput"
          v-model="searchText" 
          type="text" 
          placeholder="搜索关键词"
          @keyup.enter="handleSearch"
        >
        <div class="search-btn" @click="handleSearch">
          <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor"
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
      </div>
    </div>
    
    <div class="result-list" v-if="searchStore.searchResults.length > 0">
      <div 
        v-for="item in searchStore.searchResults" 
        :key="item.id"
        class="result-item"
        @click="handleItemClick(item)"
      >
        <div class="item-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
          <div class="tags" v-if="item.tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="searchStore.isSearching" class="loading">
      搜索中...
    </div>
    <div v-else-if="searchStore.searchResults.length === 0" class="empty-result">
      未找到相关内容
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../stores/search'

const router = useRouter()
const searchStore = useSearchStore()
const searchText = ref('')
const error = ref('')
const searchInput = ref(null)

// 添加监听器来观察状态变化
watch(() => searchStore.searchResults, (newResults) => {
  console.log('搜索结果变化:', newResults)
}, { deep: true })

watch(() => searchText.value, (newText) => {
  console.log('搜索文本变化:', newText)
})

// 修改搜索处理函数
const handleSearch = () => {
  console.log('执行搜索，当前搜索文本:', searchText.value)
  error.value = ''
  try {
    if (searchText.value.trim()) {
      searchStore.search(searchText.value)
    }
  } catch (e) {
    error.value = '搜索出错，请重试'
    console.error('搜索错误:', e)
  }
}

// 处理结果点击
const handleItemClick = (item) => {
  console.log('点击搜索结果项:', item)
  if (!item.type) {
    console.warn('Item type is missing:', item)
    return
  }

  switch (item.type) {
    case 'article':
      router.push({
        path: `/article/detail/${item.id}`,
        state: { article: item }
      })
      break
    case 'post':
      router.push({
        path: `/post/${item.id}`,
        state: { post: item }
      })
      break
    default:
      console.warn('Unknown item type:', item.type)
  }
}

onMounted(() => {
  console.log('SearchResultView mounted')
  console.log('上次搜索文本:', searchStore.lastSearchText)
  console.log('当前搜索结果:', searchStore.searchResults)
  
  if (searchStore.lastSearchText) {
    searchText.value = searchStore.lastSearchText
    console.log('恢复搜索文本:', searchText.value)
    if (searchStore.searchResults.length === 0) {
      console.log('无搜索结果，重新执行搜索')
      handleSearch()
    }
  }
  searchInput.value?.focus()
})

onUnmounted(() => {
  console.log('SearchResultView unmounted')
  console.log('卸载时的搜索状态:', {
    searchText: searchText.value,
    results: searchStore.searchResults,
    lastSearchText: searchStore.lastSearchText
  })
})
</script>

<style scoped>
.search-result {
  min-height: 100vh;
  background: #fff;
  padding-top: 60px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
  z-index: 100;
}

.back-icon {
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px 10px;
  flex: 1;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 5px;
}

.search-btn {
  cursor: pointer;
  padding: 5px;
}

.search-icon {
  color: #666;
}

.search-btn:hover {
  opacity: 0.8;
}

.result-list {
  padding: 15px;
}

.result-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.item-content h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.item-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.tags {
  margin-top: 8px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.empty-result {
  padding: 40px;
  text-align: center;
  color: #999;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}

.error-message {
  color: red;
  text-align: center;
  padding: 20px;
}
</style>
