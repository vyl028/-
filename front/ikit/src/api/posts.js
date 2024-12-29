import request from '@/utils/request'
import router from '@/router'

// 获取帖子列表
// params 可以包含：
// - search: 搜索关键字
// - category: 分类标签
export const getPosts = (params = {}) => {
  return request({
    url: '/acg/post/',
    method: 'get',
    params
  })
}

// 获取单个帖子详情
export const getPost = (id) => {
  return request({
    url: `/acg/post/${id}/`,
    method: 'get'
  })
}

// 创建帖子
export const createPost = (data) => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return Promise.reject(new Error('未登录'))
  }

  // 构造请求数据
  const postData = {
    posttitle: data.get('posttitle'),
    postcontent: data.get('postcontent'),
    postimages: JSON.stringify([`/src/assets/${data.get('imageName')}`]),
    posttags: JSON.stringify([data.get('posttags')])
  }

  return request({
    url: '/acg/post/',
    method: 'post',
    headers: {
      'Authorization': token.startsWith('JWT ') ? token : `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    data: postData
  })
}

// 搜索帖子
export const searchPosts = (keyword) => {
  return getPosts({ search: keyword })
}

// 获取分类帖子
export const getCategoryPosts = (category) => {
  return getPosts({ category })
}

// 上传图片
export const uploadImage = (formData) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.reject(new Error('未登录'))
  }

  return request({
    url: '/acg/post/upload/',
    method: 'post',
    headers: {
      'Authorization': token.startsWith('JWT ') ? token : `JWT ${token}`,
    },
    data: formData
  })
}

// 删除帖子
export const deletePost = (id) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.reject(new Error('未登录'))
  }

  return request({
    url: `/acg/post/${id}/`,
    method: 'delete',
    headers: {
      'Authorization': token.startsWith('JWT ') ? token : `JWT ${token}`,
    }
  })
}

// 更新帖子
export const updatePost = (id, data) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.reject(new Error('未登录'))
  }

  return request({
    url: `/acg/post/${id}/`,
    method: 'put',
    headers: {
      'Authorization': token.startsWith('JWT ') ? token : `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    data
  })
}

// 获取动态详情
export function getDynamicDetail(postId) {
  return request({
    url: `/acg/post/${postId}/`,
    method: 'get',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
}