import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    async getUserInfo() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) throw new Error('获取用户信息失败')
        const data = await response.json()
        this.user = data
        return data
      } catch (error) {
        throw error
      }
    },

    async updateAvatar(file) {
      const formData = new FormData()
      formData.append('avatar', file)
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })
        if (!response.ok) throw new Error('更新头像失败')
        const data = await response.json()
        this.user = { ...this.user, avatar: data.avatar }
        return data
      } catch (error) {
        throw error
      }
    }
  }
})