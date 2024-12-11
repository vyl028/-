import { defineStore } from 'pinia'
import { getPosts } from '@/api/posts'
import { ref } from 'vue'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([
    {
      id: 1,
      title: '热门话题12xxsan',
      summary: '这是一段很长的描述文字...',
      image: '🌍',
      content: '这是详细的内容...'
    },
    // ... 添加更多测试数据
  ]);

  return {
    posts
  };
});