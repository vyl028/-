<template>
  <div>
    <h2>API 测试</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

const testApi = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8000/api/posts/')
    data.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  testApi()
})
</script>
