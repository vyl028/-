import request from '@/utils/request'

// 获取所有帖子
export const getPosts = () => {
  return request({
    url: '/post/',
    method: 'get'
  })
}

// 获取分类帖子
export const getCategoryPosts = (category) => {
  return request({
    url: `/post/?category=${category}`,
    method: 'get'
  })
}

// 获取帖子详情
export const getPostDetail = (postId) => {
  return request({
    url: `/post/${postId}/`,
    method: 'get'
  })
}

// 点赞帖子
export const likePost = (postId) => {
  return request({
    url: `/like/post/${postId}/`,
    method: 'post'
  })
}

// 取消点赞
export const unlikePost = (postId) => {
  return request({
    url: `/like/post/${postId}/`,
    method: 'delete'
  })
}

// 收藏帖子
export const collectPost = (postId) => {
  return request({
    url: `/posts/${postId}/collect/`,
    method: 'post'
  })
}

// 取消收藏
export const uncollectPost = (postId) => {
  return request({
    url: `/posts/${postId}/uncollect/`,
    method: 'delete'
  })
}

// 创建新帖子

export function createPost(data) {
  console.log('API 层 - 准备发送请求:', data)
  
  // 修改为与后端 urls.py 匹配的路径
  const config = {
    url: '/post/',  // 改为与后端 urls.py 中的路径匹配
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  console.log('完整请求配置:', config)
  return request(config)
}
