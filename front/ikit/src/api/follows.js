import request from '@/utils/request'

// 获取关注列表
export function getFollows() {
  return request({
    url: '/api/follows',
    method: 'get'
  })
}

// 关注用户
export function followUser(userId) {
  return request({
    url: '/api/follows',
    method: 'post',
    data: { userId }
  })
}

// 取消关注
export function unfollowUser(userId) {
  return request({
    url: `/api/follows/${userId}`,
    method: 'delete'
  })
}
