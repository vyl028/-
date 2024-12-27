import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchResults = ref([])
  const isSearching = ref(false)
  const lastSearchText = ref('')

  // 从 localStorage 恢复状态
  const initState = JSON.parse(localStorage.getItem('searchState') || '{}')
  console.log('初始化搜索状态:', initState)
  
  if (initState.lastSearchText) {
    lastSearchText.value = initState.lastSearchText
    searchResults.value = initState.searchResults || []
  }

  // 监听状态变化并保存到 localStorage
  watch([searchResults, lastSearchText], ([newResults, newText]) => {
    console.log('搜索状态变化:', { results: newResults, text: newText })
    localStorage.setItem('searchState', JSON.stringify({
      searchResults: newResults,
      lastSearchText: newText
    }))
  }, { deep: true })

  const search = (keywords) => {
    console.log('执行搜索:', keywords)
    isSearching.value = true
    lastSearchText.value = keywords
    
    try {
      const keywordArray = keywords.toLowerCase().split(' ').filter(k => k.length > 0)
      searchResults.value = []
      
      // 获取所有可能的数据源
      const storedPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
      const mockPosts = [
        {
          id: 1,
          userId: 1,
          username: '摄影师小王',
          userAvatar: '/src/assets/avatar1.jpg',
          title: '摄影作品分享',
          content: '分享一组最近拍摄的作品...',
          images: ['/src/assets/post1.jpg'],
          tags: ['摄影', '作品分享']
        },
        // ... 其他模拟数据
      ]
      
      // 合并所有帖子数据
      const allPosts = [...storedPosts, ...mockPosts]
      // 去重，以防重复
      const uniquePosts = Array.from(new Map(allPosts.map(post => [post.id, post])).values())
      
      console.log('搜索数据源总数:', uniquePosts.length)
      
      const matchedPosts = uniquePosts.filter(post => {
        return keywordArray.every(keyword =>
          post.title?.toLowerCase().includes(keyword) ||
          post.content?.toLowerCase().includes(keyword) ||
          post.username?.toLowerCase().includes(keyword) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(keyword)))
        )
      }).map(p => ({ ...p, type: 'post' }))
      
      const articles = JSON.parse(localStorage.getItem('articles') || '[]')
      const matchedArticles = articles.filter(article => {
        return keywordArray.every(keyword =>
          article.title?.toLowerCase().includes(keyword) ||
          article.content?.toLowerCase().includes(keyword)
        )
      }).map(a => ({ ...a, type: 'article' }))
      
      searchResults.value = [...matchedPosts, ...matchedArticles]
      console.log('搜索结果:', searchResults.value)
      
    } catch (error) {
      console.error('搜索失败:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  const clearResults = () => {
    console.log('清除搜索结果')
    searchResults.value = []
    isSearching.value = false
    lastSearchText.value = ''
  }

  return {
    searchResults,
    isSearching,
    lastSearchText,
    search,
    clearResults
  }
})
