// src/utils/request.js
import axios from 'axios'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/acg',
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    // 添加详细的请求日志
    console.log('发送请求:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    })
    
    // 添加认证头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`
    }

    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    // 添加详细的响应日志
    console.log('收到响应:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    })
    return response
  },
  error => {
    console.error('响应错误:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })

    // 处理特定的错误情况
    if (error.response?.status === 401) {
      showToast('请先登录')
      // 可以在这里处理登录过期的情况
    } else if (error.response?.status === 400) {
      // 处理验证错误
      const errorMessage = Object.values(error.response.data)
        .flat()
        .join('\n')
      showToast(errorMessage || '请求参数错误')
    } else {
      showToast(error.response?.data?.message || '请求失败')
    }

    return Promise.reject(error)
  }
)
const service = axios.create({
  baseURL: '/acg/api',  // 确保这里的前缀与后端 URL 匹配
  timeout: 5000
})

// 添加请求拦截器，确保携带 token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    console.log('发送请求:', {
      url: config.baseURL + config.url,
      method: config.method,
      data: config.data
    })
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)


export default request
