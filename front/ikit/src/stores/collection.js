import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref([])
  const isLoading = ref(false)

  const fetchCollections = async () => {
    try {
      isLoading.value = true
      console.log('Fetching collections in store')
      
      // 模拟数据
      collections.value = [
        {
          id: 1,
          title: '标题标题标题标题标题标题',
          date: '11-21',
          author: 'XXX',
          content: '正文正文正文正文正文正文',
          likes: '1111',
          comments: '1w+'
        }
      ]
    } catch (error) {
      console.error('Store error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    collections,
    isLoading,
    fetchCollections
  }
}) 