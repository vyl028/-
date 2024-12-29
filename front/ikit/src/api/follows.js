import request from '@/utils/request'

// 获取关注列表
export function getFollows() {
  return request({
    url: '/acg/follows/list/',
    method: 'get'
  })
}

// 关注用户
export function followUser(userId) {
  return request({
    url: '/acg/follows/user/',
    method: 'post',
    data: { userId: userId }
  })
}

// 取消关注
export function unfollowUser(userId) {
  return request({
    url: `/acg/follows/${userId}/`,
    method: 'delete'
  })
}
