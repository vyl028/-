import request from '@/utils/request'

// 登录接口
export const login = (data) => {
  return request({
    url: '/acg/login/',
    method: 'POST',
    data
  })
}

// 注册接口
export const register = (data) => {
  return request({
    url: '/acg/register/',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/acg/profile/',
    method: 'GET'
  })
}