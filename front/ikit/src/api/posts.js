import request from '@/utils/request'

// 获取帖子列表
export const getPosts = () => {
  return request({
    url: '/api/posts',
    method: 'get'
  })
}

// 创建帖子
export const createPost = (postData) => {
  return request({
    url: '/api/posts',
    method: 'post',
    data: postData
  })
}