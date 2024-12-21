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

export const getReplyMessages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          username: '动漫迷小杰',
          avatar: '/src/assets/avatar1.jpg',
          content: '你说的对,这个手办的细节确实很棒!',
          time: '2小时前',
          sourceContent: '这款鬼灭之刃的手办做工真是精致...',
          sourceType: '动态'
        },
        {
          id: 2,
          username: '手办达人莉莉',
          avatar: '/src/assets/avatar2.jpg', 
          content: '谢谢你的建议,我会注意的!',
          time: '3小时前',
          sourceContent: '关于手办保养,我建议...',
          sourceType: '评论'
        },
        {
          id: 3,
          username: '小轩',
          avatar: '/src/assets/avatar3.jpg',
          content: '拍摄技巧分享得很详细,学习了!',
          time: '1天前',
          sourceContent: '分享一下手办摄影的经验...',
          sourceType: '文章'
        }
      ])
    }, 300)
  })
}

export const getAtMessages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          username: '动漫迷小杰',
          avatar: '/src/assets/avatar1.jpg',
          content: '@千早爱音 这个手办的涂装真不错!',
          time: '2小时前',
          sourceContent: '分享一下最近入手的手办...',
          sourceType: '动态'
        },
        {
          id: 2,
          username: '手办达人莉莉',
          avatar: '/src/assets/avatar2.jpg',
          content: '@千早爱音 求一个涂装教程!',
          time: '3小时前',
          sourceContent: '关于手办保养的一些心得...',
          sourceType: '文章'
        }
      ])
    }, 300)
  })
}

export const getLikeMessages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          username: '一米六旋转小陀螺',
          avatar: '/src/assets/avatar1.jpg',
          content: '赞了你的评论',
          time: '2024年12月18日 11:57',
          sourceContent: '这个手办的涂装真的很精致,尤其是细节部分处理得特别好',
          sourceType: '评论'
        },
        {
          id: 2,
          username: '花6币不知改啥名',
          avatar: '/src/assets/avatar2.jpg',
          content: '赞了你的评论',
          time: '2024年12月17日 10:33',
          sourceContent: '分享一下这个手办的购买渠道吧,真的很喜欢',
          sourceType: '评论'
        },
        {
          id: 3,
          username: '极乐君主',
          avatar: '/src/assets/avatar3.jpg',
          content: '等总计5人赞了你的评论',
          time: '2024年12月16日 23:51',
          sourceContent: '这个系列的手办质量都很不错,值得收藏',
          sourceType: '评论'
        }
      ])
    }, 300)
  })
}

export const getPrivateContacts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          username: 'Cos玩家',
          avatar: '/src/assets/avatar1.jpg',
          lastMessage: '手办的涂装真不错!',
          time: '2小时前',
          unread: 2
        },
        {
          id: 2,
          username: '小雪',
          avatar: '/src/assets/avatar2.jpg',
          lastMessage: '好想要这个手办',
          time: '3小时前',
          unread: 0
        },
        {
          id: 3,
          username: '动漫迷小杰',
          avatar: '/src/assets/avatar3.jpg',
          lastMessage: '分享一下购买链接吧',
          time: '昨天',
          unread: 1
        }
      ])
    }, 300)
  })
}

export const getChatMessages = (contactId) => {
  const messages = {
    1: [
      { id: 1, content: '手办的涂装真不错!', time: '2小时前', isSelf: false },
      { id: 2, content: '谢谢,这是我最近的得意之作', time: '2小时前', isSelf: true }
    ],
    2: [
      { id: 1, content: '好想要这个手办', time: '3小时前', isSelf: false },
      { id: 2, content: '可以分享一下购买链接吗', time: '3小时前', isSelf: false }
    ],
    3: [
      { id: 1, content: '分享一下购买链接吧', time: '昨天', isSelf: false },
      { id: 2, content: '好的,稍等我找一下', time: '昨天', isSelf: true }
    ]
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages[contactId] || [])
    }, 300)
  })
} 