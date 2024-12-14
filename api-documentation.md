# 接口文档

## 目录
- [底部导航栏](#底部导航栏)
- [主页](#主页)
  - [发现页面](#发现页面)
  - [广场页面](#广场页面)
- [消息页面](#消息页面)
- [关注页面](#关注页面)
- [登录注册](#登录注册)

## 底部导航栏
相关接口:
1. 主页
2. 关注
3. 消息
4. 我的（个人中心）

## 主页

### 发现页面
Base URL: http://localhost:5173/home

#### 1. 搜索接口
GET /api/search
参数：
- keyword: 搜索关键词
- page: 页码
- size: 每页数量

#### 2. 发现页面内容列表接口
GET /api/discover/list
参数：
- page: 页码
- size: 每页数量
返回：
- id: 内容ID
- title: 标题(如"XX手办分享") 
- description: 描述(如"XX手办开箱...")
- image: 图片URL
- createTime: 发布时间

#### 3. 内容详情接口
GET /api/content/{id}
参数：
- id: 内容ID

### 广场页面
Base URL: http://localhost:5173/plaza

#### 长图文

##### 1. 搜索接口
GET /api/search
参数：
- keyword: 搜索关键词
- page: 页码
- size: 每页数量

##### 2. 热门话题列表
GET /api/topics/hot
参数：
- page: 页码
- size: 每页数量
返回：
- id: 话题ID
- title: 话题标题
- rank: 排名
- heat: 热度值

##### 3. 热门活动列表
GET /api/activities/hot
参数：
- page: 页码
- size: 每页数量
返回：
- id: 活动ID
- title: 活动标题（如"二次元动漫展"）
- startTime: 开始时间
- endTime: 结束时间
- location: 活动地点
- status: 活动状态（未开始/进行中/已结束）

##### 4. "全部"查看更多
GET /api/topics/all  // 话题全部列表
GET /api/activities/all  // 活动全部列表

#### 短图文

##### 1. 内容列表接口
GET /api/content/list
参数：
- type: 内容类型（展会回顾/开箱分享等）
- page: 页码
- size: 每页数量
返回：
- id: 内容ID
- title: 标题（如"二次元动漫展精彩回顾"）
- cover: 封面图URL
- author: {
    id: 作者ID,
    nickname: 昵称（如"动漫迷小A"）,
    avatar: 头像URL
  }
- description: 描述文本
- createTime: 发布时间

### 消息页面
Base URL: http://localhost:5173/message

#### 1. 消息分类列表接口
GET /api/message/list
参数：
- type: 消息类型（回复我的/收到的赞/@我/收藏）
- page: 页码
- size: 每页数量
返回：
- id: 消息ID
- type: 消息类型
- content: 消息内容
- fromUser: 发送者信息
- createTime: 发送时间
- isRead: 是否已读

#### 2. 消息状态操作接口
POST /api/message/read  // 标记已读
POST /api/message/read-all  // 全部已读
DELETE /api/message/{id}  // 删除消息

#### 3. 未读消息计数接口
GET /api/message/unread-count
返回：
- total: 总未读数
- reply: 回复未读数
- like: 点赞未读数
- mention: @我未读数
- favorite: 收藏未读数
- system: 系统通知未读数

#### 4. 统一的消息列表接口
GET /api/message/list
参数：
- type: 消息类型（reply:回复/like:点赞/mention:@我/favorite:收藏/system:系统通知/activity:活动通知）
- page: 页码
- size: 每页数量
返回：
- id: 消息ID
- type: 消息类型
- title: 消息标题
- content: 消息内容
- fromUser: {
    id: 用户ID,
    nickname: 用户昵称,
    avatar: 头像URL
  }
- targetId: 相关内容ID（如帖子ID、活动ID等）
- createTime: 发送时间
- isRead: 是否已读

### 关注页面
Base URL: http://localhost:5173/follow

#### 1. 关注列表接口
GET /api/follow/list
参数：
- type: 关注分类（all:全部/cosplayer:Cos玩家/figure:手办控 等）
- page: 页码
- size: 每页数量
返回：
- users: [{
    id: 用户ID,
    nickname: 用户昵称,
    avatar: 头像URL,
    description: 简介,
    isFollowed: 是否已关注
  }]
- total: 总���

#### 2. 关注操作接口
POST /api/follow/action
参数：
- targetId: 目标用户ID
- action: 操作（follow:关注/unfollow:取消关注）

### 文章详情页面
Base URL: http://localhost:5173/article/detail/{id}

#### 1. 文章详情接口
GET /api/article/detail/{id}
参数：
- id: 文章ID
返回：
```json
{
    "id": "文章ID",
    "title": "文章标题",
    "content": "文章正文内容",
    "author": {
        "id": "作者ID",
        "nickname": "作者昵称",
        "avatar": "头像URL"
    },
    "createTime": "发布时间",
    "stats": {
        "viewCount": "浏览数",
        "likeCount": "点赞数",
        "commentCount": "评论数",
        "favoriteCount": "收藏数"
    },
    "isLiked": "是否已点赞",
    "isFavorited": "是否已收藏"
}
```

#### 2. 评论相关接口
##### 发表评论
POST /api/comment/add
参数：
```json
{
    "articleId": "文章ID",
    "content": "评论内容",
    "replyTo": "回复的评论ID（可选）"
}
```

##### 获取评论列表
GET /api/comment/list
参数：
- articleId: 文章ID
- page: 页码
- size: 每页数量

#### 3. 互动操作接口
POST /api/article/action
参数：
- articleId: 文章ID
- type: 操作类型（like:点赞/favorite:收藏）
- action: 操作（add/cancel）

### 全部活动界面
Base URL: http://localhost:5173/activity

#### 1. 活动列表接口
GET /api/activities/list
参数：
- page: 页码
- size: 每页数量
- status: 活动状态（all/upcoming/ongoing/ended）
返回：
```json
{
    "list": [{
        "id": "活动ID",
        "title": "活动标题",
        "cover": "活动封面图URL",
        "time": {
            "start": "2024-01-01",
            "end": "2024-01-03"
        },
        "isFavorited": false,
        "status": "upcoming"
    }],
    "hasMore": true,
    "total": "总活动数"
}
```

### 活动详情页面
Base URL: http://localhost:5173/activity/detail/{id}

#### 1. 活动详情接口
GET /api/activity/detail/{id}
参数：
- id: 活动ID
返回：
```json
{
    "id": "活动ID",
    "title": "北京CCW华彩国际动漫游戏展",
    "banner": "活动banner图URL",
    "time": {
        "start": "2024-01-01",
        "end": "2024-01-03"
    },
    "description": "活动详细描述",
    "status": "upcoming",
    "isFavorited": false
}
```

#### 2. 相关文章列表接口
GET /api/activity/related-articles
参数：
- activityId: 活动ID
- page: 页码
- size: 每页数量
返回：
```json
{
    "list": [{
        "id": "文章ID",
        "title": "CCW展会精彩回顾",
        "cover": "封面图URL",
        "summary": "本次CCW展会汇集了众多精彩展品...",
        "author": {
            "id": "作者ID",
            "nickname": "动漫达人"
        },
        "readCount": 1234,
        "createTime": "发布时间"
    }],
    "hasMore": "是否有更多"
}
```

### 登录注册界面

#### 1. 登录接口
POST /api/auth/login
请求参数：
```json
{
    "username": "用户名",
    "password": "加密后的密码",
    "deviceId": "设备ID"
}
```

返回：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "token": "JWT令牌",
        "refreshToken": "刷新令牌",
        "expiresIn": 7200,
        "userInfo": {
            "id": "用户ID",
            "nickname": "昵称",
            "avatar": "头像URL",
            "role": "用户角色"
        }
    }
}
```

#### 2. 注册接口
POST /api/auth/register
请求参数：
```json
{
    "username": "用户名",
    "password": "加密后的密码",
    "nickname": "昵称",
    "email": "邮箱",
    "verifyCode": "验证码"
}
```

返回：同登录接口

#### 3. 刷新令牌
POST /api/auth/refresh
请求头：
- Authorization: Bearer <refresh_token>
返回：同登录接口

#### 4. 退出登录
POST /api/auth/logout
请求头：
- Authorization: Bearer <token>
返回：
```json
{
    "code": 200,
    "message": "退出成功"
}
```
