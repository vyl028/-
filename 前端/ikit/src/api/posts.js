import axios from 'axios'

// 设置基础URL
axios.defaults.baseURL = 'http://localhost:8000/api'

// 获取帖子列表
export const getPosts = async () => {
  try {
    const response = await axios.get('/posts/')
    return response.data
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    throw error
  }
}

// 获取单个帖子
export const getPost = async (id) => {
  try {
    const response = await axios.get(`/posts/${id}/`)
    return response.data
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    throw error
  }
}