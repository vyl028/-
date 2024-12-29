import request from '@/utils/request'

// 创建帖子
export const createPost = (postData) => {
  return request({
    url: '/post/',
    method: 'post',
    data: {
      posttitle: postData.title,
      postcontent: postData.content,
      postimages: JSON.stringify(postData.images),
      posttags: JSON.stringify(postData.tags)
    }
  })
}

// 获取帖子列表
export const getPosts = (params) => {
  return request({
    url: '/post/',
    method: 'get',
    params
  })
}

// 获取帖子详情
export const getPostDetail = (postId) => {
  return request({
    url: `/post/${postId}/`,
    method: 'get'
  })
}