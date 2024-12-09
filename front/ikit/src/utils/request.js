import axios from 'axios'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => response,
  error => {
    showToast(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request