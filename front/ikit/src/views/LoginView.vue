<template>
    <div class="container">
      <div class="form">
        <input v-model="username" placeholder="请输入用户名" class="input" />
        <input v-model="password" type="password" placeholder="请输入密码" class="input" />
        <button @click="handleLogin" class="btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        
        <div class="signup-link">
          <router-link to="/register">没有账号？点击注册</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { showToast } from 'vant'
  import { useUserStore } from '@/stores/user'
  import { login } from '@/api/user'
  
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const username = ref('')
  const password = ref('')
  const loading = ref(false)
  
  const handleLogin = async () => {
    if (!username.value || !password.value) {
      showToast('请输入用户名和密码')
      return
    }
  
    loading.value = true
    try {
      const res = await login({
        username: username.value.trim(),
        password: password.value
      })
  
      console.log('登录响应:', res)
  
      if (!res || !res.token || !res.user) {
        throw new Error('登录响应数据不完整')
      }
  
      // 保存认证信息，确保包含 JWT 前缀
      const token = res.token.startsWith('JWT ') ? res.token : `JWT ${res.token}`
      localStorage.setItem('token', token)
      
      // 保存用户信息，包括 userid
      const userInfo = {
        ...res.user,
        userid: res.user.userid || res.user.id  // 确保保存 userid
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      userStore.setUserInfo(userInfo)
      
      console.log('保存的用户信息:', userInfo)  // 添加日志
      
      showToast('登录成功')
      
      const redirect = route.query.redirect || '/home'
      router.replace(redirect)
    } catch (error) {
      console.error('登录失败:', error)
      let errorMessage = '登录失败，请稍后重试'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showToast(errorMessage)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    padding: 20px;
  }
  
  .form {
    width: 100%;
    max-width: 400px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .btn {
    width: 100%;
    padding: 12px;
    background: #007AFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .signup-link {
    margin-top: 15px;
    text-align: center;
  }
  
  .signup-link a {
    color: #007AFF;
    text-decoration: none;
  }
  </style>