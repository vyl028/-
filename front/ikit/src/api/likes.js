import request from '@/utils/request'

// 点赞
export function likePost(postId) {
  return request({
    url: `/acg/like/post/${postId}/`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
}

// 取消点赞
export function unlikePost(postId) {
  return request({
    url: `/acg/unlike/post/${postId}/`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
}

// 获取帖子点赞状态
export function getPostLikeStatus(postId) {
  return request({
    url: `/acg/like/post/${postId}/`,
    method: 'get'
  })
} 