import axios from 'axios'
import router from '@/router'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token.startsWith('JWT ') ? token : `JWT ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          showToast('请求的资源不存在')
          break
        case 401:
          showToast('请先登录')
          router.push('/login')
          break
        default:
          showToast(error.response.data.message || '请求失败')
      }
    }
    return Promise.reject(error)
  }
)

export default request