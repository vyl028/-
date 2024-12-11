import request from '@/utils/request'
import axios from 'axios'

export const login = (data) => {
  return request({
    url: 'http://127.0.0.1:8000/login/',
    method: 'POST',
    data
  })
}

export function register(formData) {
  return request({
    url: '/api/user/register',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/users/me/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

export const updateAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  try {
    const response = await axios.post('/users/update-avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('更新头像失败:', error)
    throw error
  }
}