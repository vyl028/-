# 二次元社区开发规范文档

## 1. 项目架构

### 1.1 前端架构 (Vue 3 + Vite)

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

