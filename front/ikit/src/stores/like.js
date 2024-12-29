import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLikeStore = defineStore('like', () => {
  const likedPosts = ref(new Set())
  const postLikes = ref({})

  const toggleLike = (postId) => {
    const isLiked = likedPosts.value.has(postId)

    if (isLiked) {
      likedPosts.value.delete(postId)
      postLikes.value[postId] = Math.max(0, (postLikes.value[postId] || 0) - 1)
    } else {
      likedPosts.value.add(postId)
      postLikes.value[postId] = (postLikes.value[postId] || 0) + 1
    }

    saveToLocalStorage()

    return !isLiked
  }

  const setInitialLikes = (postId, count) => {
    if (postLikes.value[postId] === undefined) {
      postLikes.value[postId] = count || 0
    }
  }

  const isPostLiked = (postId) => {
    return likedPosts.value.has(postId)
  }

  const getLikeCount = (postId) => {
    return postLikes.value[postId] || 0
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('likedPosts', JSON.stringify([...likedPosts.value]))
    localStorage.setItem('postLikes', JSON.stringify(postLikes.value))
  }

  const loadFromLocalStorage = () => {
    try {
      const savedLikedPosts = JSON.parse(localStorage.getItem('likedPosts'))
      const savedPostLikes = JSON.parse(localStorage.getItem('postLikes'))

      if (savedLikedPosts) {
        likedPosts.value = new Set(savedLikedPosts)
      }
      if (savedPostLikes) {
        postLikes.value = savedPostLikes
      }
    } catch (error) {
      console.error('从 localStorage 恢复点赞数据失败:', error)
    }
  }

  loadFromLocalStorage()

  return {
    likedPosts,
    postLikes,
    toggleLike,
    setInitialLikes,
    isPostLiked,
    getLikeCount
  }
}) 