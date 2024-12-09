import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
  state: () => ({
    currentArticle: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchArticle(id) {
      this.isLoading = true
      try {
        // 暂时使用模拟数据
        this.currentArticle = {
          id,
          title: '超好看的手办，不买后悔！',
          authorName: '手办达人',
          authorAvatar: '/src/assets/default-avatar.jpg',
          tags: ['手办', '动漫', '开箱'],
          blocks: [
            {
              type: 'subtitle',
              content: '1、小标题'
            },
            {
              type: 'text',
              content: '正文正文正文正文正文正文正文正文正文正文'
            },
            {
              type: 'image',
              content: '/src/assets/article-image.jpg'
            }
          ],
          comments: [
            {
              username: '用户1',
              avatar: '/src/assets/avatar1.png',
              content: '太好看了！',
              time: '2小时前'
            }
          ]
        }
      } catch (error) {
        this.error = error
      } finally {
        this.isLoading = false
      }
    }
  }
}) 