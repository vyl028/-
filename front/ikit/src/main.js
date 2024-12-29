import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import { ImagePreview, Toast } from 'vant'
import { useCollectionStore } from './stores/collection'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ImagePreview)
app.use(Toast)

// 确保在挂载前初始化 store
const collectionStore = useCollectionStore()

app.mount('#app')
