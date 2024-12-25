<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 活动数据映射
const activityDataMap = {
  1: {
    id: 1,
    title: '广州暑期City walk，打卡正佳星球跨次元狂欢',
    publishTime: '2023-07-16 21:24',
    image: [
      '/src/assets/static/activity/activity1.png',
      '/src/assets/static/activity/activity1-2.png',
      '/src/assets/static/activity/activity1-3.png',
      '/src/assets/static/activity/activity1-4.png'
    ],
    paragraphs: [
      '"庄周""哪吒""冯宝宝""蜘蛛侠""铃芽""明日香"等各种经典动漫、游戏和影视"角色"惊喜亮相广州市中心...',
      '7月15日晚，广州正佳广场举行了盛大的正佳星球动漫狂欢节开幕Cosplay大巡游...',
      '“正佳星球动漫狂欢节”活动期间，观众们将穿越到一个充满动漫元素的世界，精心打造的场景让人仿佛置身于异次元；动漫巡游、主题展览、潮玩市集、二次元水上电音节、海底川剧变脸表演等超百场精彩活动不间断；更集结了“经典奥特曼”“一人之下”“游戏王”“列车超人”等国内外热门动漫IP，为广大市民、游客打造一个穿越次元壁、突破想象力的多巴胺假期。',
      '炎炎夏日，室内娱乐、避暑旅游等消费场景热度不断上升，作为华南唯一商贸类国家级4A景区和文商旅学融合的微度假目的地，正佳广场利用其室内景区清凉不晒的优势，通过正佳星球动漫狂欢节为游客带来一场清凉娱乐体验。',
      '活动期间，逢周末全场上演正佳星球大巡游；各种舞蹈快闪让人眼花缭乱，游客可以和Coser们一起跳起动漫宅舞，年轻律动起来；4楼、5楼中庭有汇集各类文创、潮玩好物的市集；在大暑当日还将举办二次元水上电音节，把泼水节带到市中心，让广大市民、游客感受音乐与水带来的“畅快一夏”……超百场互动类主题活动、别开生面的精彩表演周周都有，常玩常新，百玩不厌。',
    
    ],
    startDate: '2023-07-15',
    endDate: '2023-08-31',
    location: '广州正佳广场',
    organizer: '正佳广场',
    contact: '020-XXXXXXXX'
  },
  2: {
    id: 2,
    title: '"二次元"走进现实，老商场焕发生机',
    publishTime: '2023-07-15 18:30',
    image: ['/src/assets/static/activity/activity1-2.png'],
    paragraphs: [
      '随着二次元文化的不断发展，越来越多的商业空间开始拥抱这种新文化...',
      '本次活动将带来一场前所未有的二次元文化体验...'
    ],
    startDate: '2023-08-01',
    endDate: '2023-08-15',
    location: '广州天环广场',
    organizer: '天环广场',
    contact: '020-XXXXXXXX'
  },
  3: {
    id: 3,
    title: '最新二次元主题街区，亮相民盈·国贸城',
    publishTime: '2023-07-14 15:00',
    image: [
      '/src/assets/static/activity/activity2.png',
      '/src/assets/static/activity/activity2-2.png',
      '/src/assets/static/activity/activity2-3.png'
    ],
    paragraphs: [
      '民盈·国贸城打造全新二次元主题街区，为年轻人带来沉浸式体验...',
      '街区内设有多个主题展区，包括动漫、游戏、潮玩等多个领域...'
    ],
    startDate: '2023-08-15',
    endDate: '2023-09-15',
    location: '深圳民盈·国贸城',
    organizer: '民盈集团',
    contact: '0755-XXXXXXXX'
  }
  // ... 可以继续添加其他活动数据
}

// 根据路由参数获取活动数据
const activity = ref(null)
const relatedArticles = ref([])

onMounted(() => {
  const activityId = parseInt(route.params.id)
  activity.value = activityDataMap[activityId] || {
    title: '活动加载中...',
    publishTime: '',
    image: [],
    paragraphs: [],
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    contact: ''
  }

  // 根据活动ID设置相关文章
  relatedArticles.value = [
    {
      id: activityId + 1,
      title: `${activity.value.title}相关报道`,
      image: Array.isArray(activity.value.image) ? activity.value.image[0] : activity.value.image,
      date: activity.value.publishTime.split(' ')[0]
    },
    // ... 可以添加更多相关文章
  ]
})
</script>

<template>
  <div class="activity-detail">
    <div class="header">
      <div class="back-icon" @click="router.back()">←</div>
      <div class="title">活动详情</div>
    </div>

    <div class="content" v-if="activity">
      <div class="info-section">
        <h1>{{ activity.title }}</h1>
        <div class="publish-time">{{ activity.publishTime }}</div>
        
        <div class="article-content">
          <p>{{ activity.paragraphs[0] }}</p>
          <img :src="activity.image[0]" class="content-image" />
          
          <p>{{ activity.paragraphs[1] }}</p>
          <img :src="activity.image[1]" class="content-image" />

          <p>{{ activity.paragraphs[2] }}</p>
          <img :src="activity.image[2]" class="content-image" />
          
         
          
          
          <p>{{ activity.paragraphs[4] }}</p>
          <p>{{ activity.paragraphs[5] }}</p>
          
          <p class="subtitle">{{ activity.paragraphs[6] }}</p>
          <p>{{ activity.paragraphs[7] }}</p>
          <img :src="activity.image[3]" class="content-image" />
           <p>{{ activity.paragraphs[3] }}</p>
          
          <p>{{ activity.paragraphs[8] }}</p>
          <p>{{ activity.paragraphs[9] }}</p>
        </div>

        <div class="info-footer">
          <div class="info-item">
            <span class="label">活动时间：</span>
            <span>{{ activity.startDate }} - {{ activity.endDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动地点：</span>
            <span>{{ activity.location }}</span>
          </div>
          <div class="info-item">
            <span class="label">主办方：</span>
            <span>{{ activity.organizer }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系方式：</span>
            <span>{{ activity.contact }}</span>
          </div>
        </div>

        <!-- 添加相关文章区域 -->
        <div class="related-articles">
          <div class="related-title">相关文章</div>
          <div class="article-list">
            <div 
              v-for="article in relatedArticles" 
              :key="article.id" 
              class="article-item"
              @click="router.push(`/article/${article.id+1}`)"
            >
              <img :src="article.image" class="article-image" />
              <div class="article-info">
                <div class="article-title">{{ article.title }}</div>
                <div class="article-date">{{ article.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加写文章悬浮按钮 -->
    <div class="write-btn" @click="router.push('/article/edit')">
      <svg class="write-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.activity-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 44px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-image: linear-gradient(90deg, rgba(227, 253, 245, 1) 0%, rgba(255, 230, 250, 1) 100%);
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 100;
}

.back-icon {
  position: absolute;
  left: 15px;
  font-size: 24px;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: 0 30px;
}

.content {
  background: #fff;
  padding: 15px;
}

.publish-time {
  color: #999;
  font-size: 14px;
  margin: 10px 0 20px;
}

.article-content {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.article-content p {
  margin-bottom: 15px;
}

.content-image {
  width: 100%;
  border-radius: 8px;
  margin: 15px 0;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0;
}

.info-footer {
  margin-top: 30px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
}

.info-item {
  margin-bottom: 10px;
  font-size: 14px;
}

.label {
  color: #666;
  margin-right: 5px;
}

/* 添加相关文章样式 */
.related-articles {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 8px solid #f5f5f5;
}

.related-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  display: flex;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.article-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.article-info {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-line-clamp: 2;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  font-size: 12px;
  color: #999;
}

/* 添加写文章按钮样式 */
.write-btn {
  position: fixed;
  right: 20px;
  bottom: 120px; /* 位于评论框上方 */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4d 100%);
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 99;
}

.write-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
}

.write-btn:active {
  transform: scale(0.95);
}

.write-icon {
  color: white;
}
</style> 