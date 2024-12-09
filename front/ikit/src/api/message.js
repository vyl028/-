import request from '@/utils/request'

export const getMessageList = () => {
  return new Promise((resolve) => {
    // 模拟 API 请求
    setTimeout(() => {
      resolve([
        {
          id: 1,
          username: '系统通知',
          avatar: '/src/assets/system-avatar.png',
          content: '欢迎使用本应用',
          time: '刚刚',
          unread: true
        },
        {
          id: 2,
          username: '活动通知',
          avatar: '/src/assets/activity-avatar.png',
          content: '您关注的活动即将开始',
          time: '10分钟前',
          unread: false
        }
      ])
    }, 300)
  })
} 