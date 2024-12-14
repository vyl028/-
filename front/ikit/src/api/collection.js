import request from '@/utils/request'

export function fetchCollectionList() {
  return request({
    url: '/collections',
    method: 'get'
  })
} 