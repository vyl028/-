// src/stores/posts.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createPost, getPosts, getPostDetail } from '@/api/posts'

export const usePostStore = defineStore('posts', () => {
  // 状态
  const isLoading = ref(false)
  const posts = ref([])
  const currentPost = ref(null)

  // 创建新帖子
  const createNewPost = async (postData) => {
    isLoading.value = true
    try {
      const response = await createPost({
        title: postData.title || '分享动态',
        content: postData.content,
        images: postData.images || [],
        tags: postData.tags || []
      })
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取帖子列表
  const fetchPosts = async (params) => {
    isLoading.value = true
    try {
      const response = await getPosts(params)
      posts.value = response.data
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 获取帖子详情
  const fetchPostDetail = async (postId) => {
    isLoading.value = true
    try {
      const response = await getPostDetail(postId)
      currentPost.value = response.data
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    posts,
    currentPost,
    createPost: createNewPost,
    fetchPosts,
    fetchPostDetail
  }
})
