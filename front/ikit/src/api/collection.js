import request from '@/utils/request'

// 收藏帖子
export function collectPost(postId) {
  return request({
    url: `/acg/collect/post/${postId}/`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
}

// 取消收藏帖子
export function uncollectPost(postId) {
  return request({
    url: `/acg/uncollect/post/${postId}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
}

// 获取收藏列表
export function fetchCollectionList() {
  return request({
    url: '/acg/collections/',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
} 