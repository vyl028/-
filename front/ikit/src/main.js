// src/main.js
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import { ImagePreview, Toast } from 'vant'
import { useCollectionStore } from './stores/collection'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 初始化用户 store
const userStore = useUserStore()

// 尝试从 localStorage 恢复用户会话
const token = localStorage.getItem('token')
if (token) {
  // 如果有 token，只设置基本状态
  userStore.$patch({
    token,
    isLoggedIn: true
  })
}

app.use(router)
app.use(ImagePreview)
app.use(Toast)

// 确保在挂载前初始化 store
const collectionStore = useCollectionStore()

app.mount('#app')
