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