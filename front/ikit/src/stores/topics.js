import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTopicDetail, getTopicPosts } from '@/api/topics'

export const useTopicStore = defineStore('topics', () => {
  const topics = ref([])
  const currentTopic = ref(null)
  const topicPosts = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  async function fetchTopicDetail(id) {
    isLoading.value = true
    error.value = null
    
    try {
      // 模拟 API 调用成功
      currentTopic.value = {
        id,
        title: '关于xx模型的讨论'
      }
      
      topicPosts.value = [
        {
          id: 1,
          username: 'xxx用户',
          avatar: '/default-avatar.jpg',
          content: '这是我对于这个xxxxxx',
          image: '/car.jpg',
          articleId: 101
        },
        {
          id: 2,
          username: 'xxx用户',
          avatar: '/default-avatar.jpg',
          content: '这是我对于这个xxxxxx',
          image: '/car.jpg',
          articleId: 102
        }
      ]
      return { currentTopic: currentTopic.value, topicPosts: topicPosts.value }
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTopics() {
    isLoading.value = true
    try {
      // 模拟数据
      topics.value = [
        {
          id: 1,
          title: '关于xx模型的讨论',
          comments: 1255,
          views: 3666,
          tag: '顶部',
          articleId: 101
        },
        {
          id: 2,
          title: '关于xx发布会的讨论',
          comments: 1255,
          views: 3666,
          tag: '总结',
          articleId: 102
        }
      ]
      return topics.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    topics,
    currentTopic,
    topicPosts,
    isLoading,
    error,
    fetchTopicDetail,
    fetchTopics
  }
}) 