import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPosts, createPost as apiCreatePost } from '@/api/posts'  // 确保导入 createPost API

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const currentPost = ref(null)
  const isLoading = ref(false)

  // 保留原有的获取帖子列表方法
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

  // 添加创建帖子的方法
  const createPost = async (postData) => {
    console.log('Store: 开始创建帖子:', postData)
    isLoading.value = true
    try {
      const response = await apiCreatePost(postData)
      console.log('Store: 创建帖子成功:', response)
      // 将新帖子添加到列表开头
      if (response.data) {
        posts.value.unshift(response.data)
      }
      return response.data
    } catch (error) {
      console.error('Store: 创建帖子失败:', error)
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
    createPost  // 确保导出 createPost 方法
  }
})