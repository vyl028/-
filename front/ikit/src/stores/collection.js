import { defineStore } from 'pinia'

export const useCollectionStore = defineStore('collection', {
  state: () => {
    // 从 localStorage 加载初始数据
    let savedCollections = {}
    let savedCounts = {}

    try {
      savedCollections = JSON.parse(localStorage.getItem('collections') || '{}')
      savedCounts = JSON.parse(localStorage.getItem('collectionCounts') || '{}')
    } catch (e) {
      console.error('Failed to load collections from localStorage:', e)
    }

    return {
      collections: savedCollections,
      collectionCounts: savedCounts
    }
  },

  actions: {
    setInitialCollections(postId, count) {
      if (!this.collectionCounts[postId]) {
        this.collectionCounts[postId] = count
      }
    },

    isPostCollected(postId) {
      return !!this.collections[postId]
    },

    getCollectionCount(postId) {
      return this.collectionCounts[postId] || 0
    },

    fetchCollections() {
      return Object.values(this.collections)
    },

    toggleCollection(post) {
      const postId = post.id
      const isCurrentlyCollected = !!this.collections[postId]

      if (isCurrentlyCollected) {
        delete this.collections[postId]
        const currentCount = this.collectionCounts[postId] || 0
        this.collectionCounts[postId] = Math.max(0, currentCount - 1)
      } else {
        this.collections[postId] = {
          ...post,
          collectCount: (this.collectionCounts[postId] || 0) + 1
        }
        this.collectionCounts[postId] = (this.collectionCounts[postId] || 0) + 1
      }

      // 保存到 localStorage
      try {
        localStorage.setItem('collections', JSON.stringify(this.collections))
        localStorage.setItem('collectionCounts', JSON.stringify(this.collectionCounts))
      } catch (e) {
        console.error('Failed to save collections to localStorage:', e)
      }

      return !isCurrentlyCollected
    }
  }
}) 