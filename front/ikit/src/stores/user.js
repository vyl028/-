import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentUser } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const isLoggedIn = ref(false)

  const getUserInfo = async () => {
    try {
      const data = await getCurrentUser()
      userInfo.value = data
      isLoggedIn.value = true
      return data
    } catch (error) {
      userInfo.value = null
      isLoggedIn.value = false
      throw error
    }
  }

  return {
    userInfo,
    isLoggedIn,
    getUserInfo
  }
})