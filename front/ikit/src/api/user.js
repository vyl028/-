// src/api/user.js
import request from '@/utils/request'

// 登录接口
export const login = (data) => {
  console.log('发送登录请求:', data)  // 添加日志
  return request({
    url: '/login/',  // 注意这里的路径
    method: 'POST',
    data: {
      username: data.username,
      password: data.password
    }
  })
}

// 注册接口
export const register = (data) => {
  console.log('发送注册请求:', data)  // 添加日志
  return request({
    url: '/register/',
    method: 'POST',
    data: {
      username: data.username,
      password: data.password
    }
  })
}
