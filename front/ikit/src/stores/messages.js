// stores/messages.js
import { defineStore } from 'pinia';

//引入头像图片
import avatar1 from '@/assets/messages/1.jpg';
import avatar2 from '@/assets/messages/2.jpg';
import avatar3 from '@/assets/messages/3.jpg';
import avatar4 from '@/assets/messages/4.jpg';
import avatar5 from '@/assets/messages/5.jpg';
import avatar6 from '@/assets/messages/6.jpg';

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    replyMessages: [
      {
        id: 1,
        avatar: avatar1,
        username: '局外人',
        time: '1小时前',
        content: '这个手办真不错！',
        sourceType: '动态',
        sourceContent: '今天终于收到了期待已久的《鬼灭之刃》',
      },
      {
        id: 2,
        avatar: avatar2,
        username: '克林没有18号',
        time: '2小时前',
        content: '让我加入光荣的地米库学说！',
        sourceType: '评论',
        sourceContent: '这个世界是一个巨大的初音未来。',
      },
      {
        id: 3,
        avatar: avatar3,
        username: '莹蓝色的星星',
        time: '2小时前',
        content: '原神，启动',
        sourceType: '动态',
        sourceContent: '原神角色展示',
      },
      {
        id: 4,
        avatar: avatar4,
        username: '保护我方御坂',
        time: '1天前',
        content: '浅置贵臀',
        sourceType: '文章',
        sourceContent: '龙族番外',
      },
      {
        id: 5,
        avatar: avatar5,
        username: '飞过海洋去看猪',
        time: '2024-12-01 10:33',
        content: '邮手就行',
        sourceType: '评论',
        sourceContent: '劳斯真是心灵手巧',
      },
      {
        id: 6,
        avatar: avatar6,
        username: 'Emotive',
        time: '2024-11-30 4:53',
        content: '太有实力了',
        sourceType: '动态',
        sourceContent: '最近入手了限定版明日香手办，质感非常棒！',
      },
    ],
    atMessages: [
      {
        id: 1,
        avatar: avatar2,
        username: '克林没有18号',
        time: '3小时前',
        content: '@千早爱音，快来看你的最爱！',
        sourceType: '动态',
        sourceContent: '手办摄影作品分享',
      },
      {
        id: 2,
        avatar: avatar1,
        username: '局外人',
        time: '5小时前',
        content: '@千早爱音这你不得露一手',
        sourceType: '文章',
        sourceContent: '手办修复日志：从破损到焕新',
      },
    ],
    likeMessages: [
      {
        id: 1,
        avatar: avatar1,
        username: '局外人',
        time: '1小时前',
        content: '赞了你',
        sourceType: '动态',
        sourceContent: '今天终于收到了期待已久的《鬼灭之刃》',
      },
      {
        id: 2,
        avatar: avatar2,
        username: '克林没有18号',
        time: '2小时前',
        content: '赞了你',
        sourceType: '评论',
        sourceContent: '这个世界是一个巨大的初音未来。',
      },
      {
        id: 3,
        avatar: avatar3,
        username: '莹蓝色的星星',
        time: '2小时前',
        content: '赞了你',
        sourceType: '动态',
        sourceContent: '原神角色展示',
      },
      {
        id: 4,
        avatar: avatar4,
        username: '保护我方御坂',
        time: '1天前',
        content: '赞了你',
        sourceType: '文章',
        sourceContent: '龙族番外',
      },
      {
        id: 5,
        avatar: avatar5,
        username: '飞过海洋去看猪',
        time: '2024-12-01 10:33',
        content: '赞了你',
        sourceType: '评论',
        sourceContent: '劳斯真是心灵手巧',
      },
      {
        id: 6,
        avatar: avatar6,
        username: 'Emotive',
        time: '2024-11-30 4:53',
        content: '赞了你',
        sourceType: '动态',
        sourceContent: '最近入手了限定版明日香手办，质感非常棒！',
      },
    ],
    privateMessages: [
      {
        id: 1,
        avatar: avatar3,
        username: '莹蓝色的星星',
        time: '20分钟前',
        content: '在吗？在吗？原神里你最喜欢谁？',
      },
      {
        id: 2,
        avatar: avatar6,
        username: 'Emotive',
        time: '40分钟前',
        content: '你好',
      },
    ],
    allMessages:[
      {
        id: 1,
        avatar: avatar1,
        username: '局外人',
        time: '1小时前',
        content: '赞了你',
        sourceType: '动态',
        sourceContent: '今天终于收到了期待已久的《鬼灭之刃》',
      },
      {
        id: 2,
        avatar: avatar1,
        username: '局外人',
        time: '1小时前',
        content: '这个手办真不错！',
        sourceType: '动态',
        sourceContent: '今天终于收到了期待已久的《鬼灭之刃》',
      },
      {
        id: 3,
        avatar: avatar2,
        username: '克林没有18号',
        time: '2小时前',
        content: '赞了你',
        sourceType: '评论',
        sourceContent: '这个世界是一个巨大的初音未来。',
      },
      {
        id: 4,
        avatar: avatar2,
        username: '克林没有18号',
        time: '2小时前',
        content: '让我加入光荣的地米库学说！',
        sourceType: '评论',
        sourceContent: '这个世界是一个巨大的初音未来。',
      },
      {
        id: 5,
        avatar: avatar3,
        username: '莹蓝色的星星',
        time: '2小时前',
        content: '赞了你',
        sourceType: '动态',
        sourceContent: '原神角色展示',
      },
      {
        id: 6,
        avatar: avatar3,
        username: '莹蓝色的星星',
        time: '2小时前',
        content: '原神，启动',
        sourceType: '动态',
        sourceContent: '原神角色展示',
      },
      {
        id: 7,
        avatar: avatar2,
        username: '克林没有18号',
        time: '3小时前',
        content: '@千早爱音，快来看你的最爱！',
        sourceType: '动态',
        sourceContent: '手办摄影作品分享',
      },
      {
        id: 8,
        avatar: avatar1,
        username: '局外人',
        time: '5小时前',
        content: '@千早爱音这你不得露一手',
        sourceType: '文章',
        sourceContent: '手办修复日志：从破损到焕新',
      },
      {
        id: 9,
        avatar: avatar4,
        username: '保护我方御坂',
        time: '1天前',
        content: '赞了你',
        sourceType: '文章',
        sourceContent: '龙族番外',
      },
      {
        id: 10,
        avatar: avatar4,
        username: '保护我方御坂',
        time: '1天前',
        content: '浅置贵臀',
        sourceType: '文章',
        sourceContent: '龙族番外',
      },
      {
        id: 11,
        avatar: avatar5,
        username: '飞过海洋去看猪',
        time: '2024-12-01 10:33',
        content: '赞了你',
        sourceType: '评论',
        sourceContent: '劳斯真是心灵手巧',
      },
      {
        id: 12,
        avatar: avatar5,
        username: '飞过海洋去看猪',
        time: '2024-12-01 10:33',
        content: '邮手就行',
        sourceType: '评论',
        sourceContent: '劳斯真是心灵手巧',
      },
      {
        id: 13,
        avatar: avatar6,
        username: 'Emotive',
        time: '2024-11-30 4:53',
        content: '赞了你',
        sourceType: '动态',
        sourceContent: '最近入手了限定版明日香手办，质感非常棒！',
      },
      {
        id: 14,
        avatar: avatar6,
        username: 'Emotive',
        time: '2024-11-30 4:53',
        content: '太有实力了',
        sourceType: '动态',
        sourceContent: '最近入手了限定版明日香手办，质感非常棒！',
      },
    ],
  }),
  actions: {
    fetchReplyMessages() {
      return this.replyMessages;
    },
    fetchAtMessages() {
      return this.atMessages;
    },
    fetchLikeMessages() {
      return this.likeMessages;
    },
    fetchPrivateMessages() {
      return this.privateMessages;
    },
    fetchAllMessages(){
      return this.allMessages;
    },
  },
});

