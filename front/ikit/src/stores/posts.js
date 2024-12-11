import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createPost } from '@/api/posts'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const currentPost = ref(null)
  const isLoading = ref(false)

  // 获取帖子列表
  const fetchPosts = async () => {
    isLoading.value = true
    try {
      const response = await getPosts()
      posts.value = response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 创建新帖子
  const createNewPost = async (postData) => {
    isLoading.value = true
    try {
      const response = await createPost(postData)
      posts.value.unshift(response.data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    currentPost,
    isLoading,
    fetchPosts,
    createPost: createNewPost
  }
})