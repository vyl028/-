import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchResults = ref([])
  const isSearching = ref(false)

  const search = (keywords) => {
    isSearching.value = true
    
    try {
      const keywordArray = keywords.toLowerCase().split(' ').filter(k => k.length > 0)
      searchResults.value = []
      
      // 获取帖子和文章数据
      const posts = JSON.parse(localStorage.getItem('allPosts') || '[]')
      const articles = JSON.parse(localStorage.getItem('articles') || '[]')
      
      // 搜索帖子
      const matchedPosts = posts.filter(post => {
        return keywordArray.every(keyword =>
          post.title?.toLowerCase().includes(keyword) ||
          post.content?.toLowerCase().includes(keyword) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(keyword)))
        )
      }).map(p => ({ ...p, type: 'post' }))
      
      // 搜索文章
      const matchedArticles = articles.filter(article => {
        return keywordArray.every(keyword =>
          article.title?.toLowerCase().includes(keyword) ||
          article.content?.toLowerCase().includes(keyword)
        )
      }).map(a => ({ ...a, type: 'article' }))
      
      // 合并搜索结果
      searchResults.value = [...matchedPosts, ...matchedArticles]
      
    } catch (error) {
      console.error('搜索失败:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  // 添加清空结果方法
  const clearResults = () => {
    searchResults.value = []
    isSearching.value = false
  }

  return {
    searchResults,
    isSearching,
    search,
    clearResults
  }
})
