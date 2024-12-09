import { defineStore } from 'pinia'
import { getHotTopics, getHotActivities } from '@/api/plaza'

export const usePlazaStore = defineStore('plaza', {
  state: () => ({
    hotTopics: [],
    hotActivities: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchHotTopics() {
      this.loading = true
      try {
        const data = await getHotTopics()
        this.hotTopics = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})