import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getFollows } from '@/api/follows';

export const useFollowStore = defineStore('follow', () => {
  const follows = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 获取关注列表
  async function fetchFollows() {
    isLoading.value = true;
    try {
      // 临时使用模拟数据
      follows.value = [
        {
          id: 1,
          name: '动漫达人',
          avatar: '/src/assets/avatar1.jpg',
          description: '分享各种动漫周边和手办'
        },
        {
          id: 2,
          name: 'Cos玩家',
          avatar: '/src/assets/avatar2.jpg',
          description: '专注分享各种精美cos照片'
        },
        {
          id: 3,
          name: '手办控',
          avatar: '/src/assets/avatar3.jpg',
          description: '专业的手办评测与分享'
        }
      ];
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    follows,
    isLoading,
    error,
    fetchFollows
  };
});
