import request from '@/utils/request'

export function getActivityList() {
  return request({
    url: '/api/activity/list',
    method: 'get'
  })
}

export function toggleCollect(activityId) {
  return request({
    url: `/api/activity/collect/${activityId}`,
    method: 'post'
  })
}

export function getActivityDetail(id) {
  return request({
    url: `/api/activity/detail/${id}`,
    method: 'get'
  })
} 