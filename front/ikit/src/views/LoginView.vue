<!-- src/views/LoginView.vue -->
<template>
  <div class="container">
    <div class="form">
      <input 
        v-model="username" 
        placeholder="请输入用户名" 
        class="input"
        @keyup.enter="handleLogin"
      />
      
      <input 
        v-model="password" 
        type="password" 
        placeholder="请输入密码" 
        class="input"
        @keyup.enter="handleLogin"
      />
      
      <button 
        @click="handleLogin" 
        class="btn"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <button v-if="userStore.isLoggedIn" @click="handleLogout" class="btn logout-btn">
        退出登录
      </button>
      
      <div class="signup-link">
        <router-link to="/register">没有账号？点击注册</router-link>
      </div>

      <!-- 添加调试信息 -->
      <div v-if="isDev" class="debug-info">
        <p>Token: {{ userStore.token ? '已存在' : '无' }}</p>
        <p>登录状态: {{ userStore.isLoggedIn ? '已登录' : '未登录' }}</p>
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
const loading = ref(false)
const isDev = process.env.NODE_ENV === 'development'

const handleLogin = async () => {
  if (!username.value || !password.value) {
    showToast('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    console.log('开始登录:', { username: username.value })
    // 登录接口已经返回用户信息，不需要再调用 fetchUserInfo
    const response = await userStore.login(username.value, password.value)
    console.log('登录成功:', response)
    
    showToast('登录成功')
    router.push('/home')
  } catch (error) {
    console.error('登录失败:', error)
    showToast(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 添加登出方法
const handleLogout = () => {
  userStore.logout()
  showToast('已退出登录')
  // 刷新页面以清除状态
  window.location.reload()
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

.logout-btn {
  margin-top: 20px;
  margin-bottom: 20px;
  background: #ff4444;
}

.debug-info {
  margin-top: 20px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}
</style>
