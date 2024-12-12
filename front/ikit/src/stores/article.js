import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticleStore = defineStore('article', () => {
  const userArticles = ref([])
  const currentArticle = ref(null)
  const isLoading = ref(false)

  const fetchUserArticles = async () => {
    try {
      isLoading.value = true
      // 模拟数据
      userArticles.value = [
        {
          id: 1,
          title: '标题标题标题标题标题标题',
          date: '11-21',
          summary: '正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文',
          images: ['/src/assets/article1.jpg', '/src/assets/article2.jpg']
        },
        {
          id: 2,
          title: '标题标题标题标题标题标题',
          date: '11-21',
          summary: '正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文',
          images: ['/src/assets/article3.jpg', '/src/assets/article4.jpg']
        }
      ]
    } finally {
      isLoading.value = false
    }
  }

  const fetchArticleDetail = async (id) => {
    try {
      isLoading.value = true
      // 模拟获取文章详情
      currentArticle.value = {
        id,
        title: '标题标题标题标题标题标题',
        date: '11-21',
        content: '正文正文正文正文正文正文正文正文正文正文',
        author: {
          id: 1,
          name: '作者名称',
          avatar: '/src/assets/default-avatar.jpg'
        },
        blocks: [
          {
            type: 'text',
            content: '正文正文正文正文正文正文正文正文正文正文'
          }
        ]
      }
      return currentArticle.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    userArticles,
    currentArticle,
    isLoading,
    fetchUserArticles,
    fetchArticleDetail
  }
}) 