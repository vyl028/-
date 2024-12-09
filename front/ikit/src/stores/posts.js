import { defineStore } from 'pinia'
import { getPosts } from '@/api/posts'

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchPosts() {
      this.loading = true
      try {
        const data = await getPosts()
        this.posts = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})