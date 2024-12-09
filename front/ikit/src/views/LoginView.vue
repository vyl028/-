<template>
    <div class="container">
      <div class="form">
        <input v-model="username" placeholder="请输入用户名" class="input" />
        <input v-model="password" type="password" placeholder="请输入密码" class="input" />
        <button @click="handleLogin" class="btn">登录</button>
        
        <div class="signup-link">
          <router-link to="/register">没有账号？点击注册</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { showToast } from 'vant'
  import { useUserStore } from '@/stores/user'
  
  const router = useRouter()
  const userStore = useUserStore()
  const username = ref('')
  const password = ref('')
  
  const handleLogin = async () => {
    if (!username.value || !password.value) {
      showToast('请输入用户名和密码')
      return
    }
  
    try {
      await userStore.login(username.value, password.value)
      showToast('登录成功')
      router.push('/home')
    } catch (error) {
      showToast('登录失败')
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
  
  .signup-link {
    margin-top: 15px;
    text-align: center;
  }
  
  .signup-link a {
    color: #007AFF;
    text-decoration: none;
  }
  </style>