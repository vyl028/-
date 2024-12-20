import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFollowStore = defineStore('follow', () => {
  // 默认关注数据
  const defaultFollows = [
    {
      id: 1,
      name: '动漫迷小杰',
      avatar: '/src/assets/avatar1.jpg',
      isFollowed: true
    },
    {
      id: 2,
      name: 'Cos玩家',
      avatar: '/src/assets/avatar2.jpg',
      isFollowed: true
    }
  ];

  const follows = ref([...defaultFollows]);
  const followedUsers = ref(new Set([1, 2]));

  // 初始化本地存储
  const initLocalStorage = () => {
    const stored = localStorage.getItem('follows');
    if (!stored) {
      localStorage.setItem('follows', JSON.stringify(defaultFollows));
      follows.value = [...defaultFollows];
    } else {
      try {
        follows.value = JSON.parse(stored);
      } catch (error) {
        console.error('解析本地存储数据失败:', error);
        follows.value = [...defaultFollows];
      }
    }
  };

  // 获取关注列表
  const fetchFollows = async () => {
    try {
      initLocalStorage();
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      return follows.value;
    } catch (error) {
      console.error('获取关注列表失败:', error);
      return defaultFollows;
    }
  };

  // 关注用户
  const followUser = async (userId) => {
    try {
      const userToAdd = defaultFollows.find(f => f.id === userId);
      if (userToAdd && !followedUsers.value.has(userId)) {
        followedUsers.value.add(userId);
        follows.value.push({...userToAdd, isFollowed: true});
        localStorage.setItem('follows', JSON.stringify(follows.value));
      }
    } catch (error) {
      console.error('关注用户失败:', error);
      throw error;
    }
  };

  // 取消关注用户
  const unfollowUser = async (userId) => {
    try {
      followedUsers.value.delete(userId);
      follows.value = follows.value.filter(f => f.id !== userId);
      localStorage.setItem('follows', JSON.stringify(follows.value));
    } catch (error) {
      console.error('取消关注失败:', error);
      throw error;
    }
  };

  return {
    follows,
    followedUsers,
    fetchFollows,
    followUser,
    unfollowUser
  };
});
