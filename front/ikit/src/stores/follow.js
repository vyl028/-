import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFollowStore = defineStore('follow', () => {
  const follows = ref([])
  const followedUsers = ref(new Set())
  const userPosts = ref({}) // 存储用户的帖子数据

  // 初始化本地存储
  const initLocalStorage = () => {
    const stored = localStorage.getItem('follows')
    const storedPosts = localStorage.getItem('allPosts')
    
    if (stored) {
      try {
        const parsedFollows = JSON.parse(stored)
        follows.value = parsedFollows
        parsedFollows.forEach(user => followedUsers.value.add(user.id))
        
        // 同时加载帖子数据
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts)
          userPosts.value = parsedPosts.reduce((acc, post) => {
            if (!acc[post.userId]) {
              acc[post.userId] = []
            }
            acc[post.userId].push(post)
            return acc
          }, {})
        }
      } catch (error) {
        console.error('解析本地存储数据失败:', error)
      }
    }
  }

  // 获取关注列表
  const fetchFollows = async () => {
    initLocalStorage()
    return follows.value
  }

  // 添加新方法
  const updateUserPosts = (userId, posts) => {
    userPosts.value[userId] = posts
  }

  // 关注用户
  const followUser = async (userId, userInfo = {}) => {
    // 确保 userId 是数字类型
    const numericUserId = Number(userId)
    if (!followedUsers.value.has(numericUserId)) {
      const newFollow = {
        id: numericUserId,  // 使用数字类型的 ID
        name: userInfo.name || '用户名',
        avatar: userInfo.avatar || '/src/assets/default-avatar.jpg',
        isFollowed: true,
        ...userInfo
      }
      follows.value.push(newFollow)
      followedUsers.value.add(numericUserId)
      
      // 更新该用户的帖子数据
      const allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]')
      const userPosts = allPosts.filter(post => Number(post.userId) === numericUserId)
      updateUserPosts(numericUserId, userPosts)
      
      localStorage.setItem('follows', JSON.stringify(follows.value))
    }
  }

  // 取消关注
  const unfollowUser = async (userId) => {
    follows.value = follows.value.filter(f => f.id !== userId)
    followedUsers.value.delete(userId)
    localStorage.setItem('follows', JSON.stringify(follows.value))
  }

  return {
    follows,
    followedUsers,
    fetchFollows,
    followUser,
    unfollowUser,
    isFollowing: (userId) => followedUsers.value.has(userId),
    getUserPosts: (userId) => userPosts.value[userId] || []
  }
})
