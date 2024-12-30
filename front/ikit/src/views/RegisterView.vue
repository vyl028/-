<!-- src/views/RegisterView.vue -->
<template>
  <div class="container">
    <div class="form">
      <input 
        v-model="username" 
        placeholder="请输入用户名" 
        class="input"
        @keyup.enter="handleRegister"
      />
      
      <input 
        v-model="password" 
        type="password" 
        placeholder="请输入密码" 
        class="input"
        @keyup.enter="handleRegister"
      />
      
      <input 
        v-model="confirmPassword" 
        type="password" 
        placeholder="请确认密码" 
        class="input"
        @keyup.enter="handleRegister"
      />
      
      <button 
        @click="handleRegister" 
        class="btn"
        :disabled="loading"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>
      
      <div class="login-link">
        <router-link to="/login">已有账号？点击登录</router-link>
      </div>

      <!-- 添加调试信息 -->
      <div v-if="isDev" class="debug-info">
        <p>用户名长度: {{ username.length }}</p>
        <p>密码匹配: {{ password === confirmPassword ? '是' : '否' }}</p>
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
const confirmPassword = ref('')
const loading = ref(false)
const isDev = process.env.NODE_ENV === 'development'

const handleRegister = async () => {
  // 表单验证
  if (!username.value || !password.value || !confirmPassword.value) {
    showToast('请填写完整信息')
    return
  }

  if (password.value !== confirmPassword.value) {
    showToast('两次密码不一致')
    return
  }

  if (username.value.length < 3) {
    showToast('用户名至少3个字符')
    return
  }

  if (password.value.length < 6) {
    showToast('密码至少6个字符')
    return
  }

  loading.value = true
  try {
    console.log('开始注册:', { username: username.value })
    const response = await userStore.register(username.value, password.value)
    console.log('注册成功:', response)
    
    showToast('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    showToast(error.message || '注册失败，请稍后重试')
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

.login-link {
  margin-top: 15px;
  text-align: center;
}

.login-link a {
  color: #007AFF;
  text-decoration: none;
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
