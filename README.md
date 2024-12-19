# 二次元社区开发规范文档

## 1. 项目架构

### 1.1 前端架构与api接口 (Vue 3 + Vite)

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── views/          # 页面组件
├── router/         # 路由配置
├── store/          # Pinia状态管理
├── api/            # API接口封装
├── utils/          # 工具函数
├── styles/         # 全局样式
└── tests/          # 测试文件

```


### 1. 用户系统接口
```
/api/user
- POST /login - 用户登录
- POST /register - 用户注册
- GET /profile - 获取用户信息
- PUT /profile - 更新用户信息
- POST /avatar - 更新用户头像
- GET /stats - 获取用户统计数据(收藏数、粉丝数、关注数)
```

### 2. 文章系统接口
```
/api/articles
- GET / - 获取文章列表
- GET /user/:userId - 获取用户的文章列表
- GET /:id - 获取文章详情
- POST / - 发布文章
- PUT /:id - 更新文章
- DELETE /:id - 删除文章
- POST /:id/like - 点赞文章
- DELETE /:id/like - 取消点赞
- POST /:id/collect - 收藏文章
- DELETE /:id/collect - 取消收藏
```

### 3. 动态系统接口
```
/api/posts
- GET / - 获取动态列表
- GET /:id - 获取动态详情
- POST / - 发布动态
- DELETE /:id - 删除动态
- POST /:id/like - 点赞动态
- DELETE /:id/like - 取消点赞
- GET /category/:category - 获取分类动态
```

### 4. 评论系统接口
```
/api/comments
- GET /article/:id - 获取文章评论
- GET /post/:id - 获取动态评论
- POST /article/:id - 发表文章评论
- POST /post/:id - 发表动态评论
- DELETE /:id - 删除评论
- POST /:id/like - 点赞评论
- DELETE /:id/like - 取消点赞评论
- POST /:id/reply - 回复评论
```

### 5. 关注系统接口
```
/api/follows
- GET /followers - 获取粉丝列表
- GET /following - 获取关注列表
- POST /:userId - 关注用户
- DELETE /:userId - 取消关注
```

### 6. 活动系统接口
```
/api/activities
- GET / - 获取活动列表
- GET /:id - 获取活动详情
- GET /related/:id - 获取相关活动
```

### 7. 话题系统接口
```
/api/topics
- GET / - 获取话题列表
- GET /:id - 获取话题详情
- GET /:id/posts - 获取话题下的帖子
```

### 8. 搜索接口
```
/api/search
- GET /articles - 搜索文章
- GET /posts - 搜索动态
- GET /users - 搜索用户
- GET /topics - 搜索话题
```

### 9. 图片上传接口
```
/api/upload
- POST /image - 上传图片
- POST /images - 批量上传图片
```


### 1.2 命名规范

#### Vue组件命名
- 组件文件名使用PascalCase: `UserProfile.vue`
- 组件name属性使用PascalCase: `name: 'UserProfile'`
- 避免使用混合命名方式

#### API响应格式
```json
{
  "code": 200,
  "message": "success", 
  "data": {
    "id": 1,
    "title": "标题",
    "content": "内容"
  }
}
```

### 1.3 代码风格
- 使用ESLint + Prettier进行代码格式化
- 组件使用Composition API + `<script setup>`
- Props定义需要详细的类型和默认值
- 避免过深的嵌套结构

### 1.4 性能优化
- 路由懒加载
- 组件按需引入
- 大图片使用CDN
- 合理使用缓存

