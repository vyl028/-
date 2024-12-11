import request from '@/utils/request'

// 获取话题列表
export function getTopics() {
  return request({
    url: '/api/topics',
    method: 'get'
  })
}

// 获取话题详情
export function getTopicDetail(id) {
  return request({
    url: `/api/topics/${id}`,
    method: 'get'
  })
}

export function getTopicPosts(id) {
  return request({
    url: `/api/topics/${id}/posts`,
    method: 'get'
  })
} 