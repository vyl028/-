import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: 'http://127.0.0.1:8000/login/',
    method: 'POST',
    data
  })
}

export function register(formData) {
  return request({
    url: '/api/user/register',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}