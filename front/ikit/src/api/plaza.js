import axios from 'axios'

// 获取热门话题列表
export const getHotTopics = async () => {
  try {
    const response = await axios.get('/api/hot-topics')
    return response.data
  } catch (error) {
    console.error('获取热门话题失败:', error)
    throw error
  }
}

// 获取热门活动列表
export const getHotActivities = async () => {
  try {
    const response = await axios.get('/api/hot-activities')
    return response.data
  } catch (error) {
    console.error('获取热门活动失败:', error)
    throw error
  }
}