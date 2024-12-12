import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFansStore = defineStore('fans', () => {
  const fans = ref([])
  const isLoading = ref(false)

  const fetchFans = async () => {
    try {
      isLoading.value = true
      // 模拟数据
      fans.value = [
        {
          id: 1,
          username: '用户名',
          avatar: '/src/assets/default-avatar.jpg',
          tags: ['标签标签', '标签标签标签'],
          description: '用户简介用户简介用户简介...',
          isFollowed: false
        },
        {
          id: 2,
          username: '用户名用户名',
          avatar: '/src/assets/default-avatar.jpg',
          tags: ['标签标签'],
          description: '用户简介用户简介...',
          isFollowed: true
        },
        {
          id: 3,
          username: '用户名用户名用户名',
          avatar: '/src/assets/default-avatar.jpg',
          tags: ['标签标签标签', '标签'],
          description: '用户简介...',
          isFollowed: false
        }
      ]
    } catch (error) {
      console.error('获取粉丝列表失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const followUser = async (userId) => {
    // 实现关注用户的逻辑
  }

  const unfollowUser = async (userId) => {
    // 实现取消关注的逻辑
  }

  return {
    fans,
    isLoading,
    fetchFans,
    followUser,
    unfollowUser
  }
}) 