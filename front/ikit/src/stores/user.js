// src/stores/user.js
import { defineStore } from 'pinia'
import { login, register } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    // 登录方法
    async login(username, password) {
      try {
        const response = await login({ username, password })
        
        // 根据后端返回的数据结构保存信息
        this.token = response.data.token
        this.user = response.data.user
        this.isLoggedIn = true
        
        // 保存 token 到本地存储
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error) {
        console.error('登录失败:', error)
        // 处理错误信息
        const errorMessage = error.response?.data?.errors?.non_field_errors?.[0] 
          || error.response?.data?.messages 
          || '登录失败'
        throw new Error(errorMessage)
      }
    },

    // 注册方法
    async register(username, password) {
      try {
        const response = await register({ username, password })
        
        // 保存注册成功后的信息
        this.token = response.data.token
        this.user = response.data.user
        this.isLoggedIn = true
        
        // 保存 token 到本地存储
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error) {
        console.error('注册失败:', error)
        // 处理错误信息
        const errorMessage = error.response?.data?.errors?.non_field_errors?.[0] 
          || error.response?.data?.messages 
          || '注册失败'
        throw new Error(errorMessage)
      }
    },

    // 登出方法
    logout() {
      this.token = ''
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
      this.$reset()
    }
  }
})
