<!-- src/components/CommonTabs.vue -->
<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeTab = ref(route.path.includes('plaza') ? 'plaza' : 'discover')
const underlineStyle = ref({ width: '0px', left: '0px' })

// 监听路由变化
watch(() => route.path, (newPath) => {
  activeTab.value = newPath.includes('plaza') ? 'plaza' : 'discover'
  nextTick(updateUnderlinePosition)
})

const updateUnderlinePosition = () => {
  const activeTabElement = document.querySelector(`.tab-${activeTab.value}`)
  if (activeTabElement) {
    const textElement = activeTabElement.querySelector('.tab-text')
    const textWidth = textElement.offsetWidth
    const { left } = textElement.getBoundingClientRect()
    const parentLeft = activeTabElement.parentElement.getBoundingClientRect().left
    
    underlineStyle.value = {
      width: `${textWidth}px`,
      left: `${left - parentLeft}px`,
      transition: 'all 0.3s ease'
    }
  }
}

const handleTabChange = (tab) => {
  activeTab.value = tab
  if (tab === 'plaza') {
    router.push('/plaza')
  } else {
    router.push('/home')
  }
  nextTick(updateUnderlinePosition)
}

onMounted(() => {
  console.log('CommonTabs mounted')
  nextTick(() => {
    console.log('Updating underline position')
    updateUnderlinePosition()
  })
  window.addEventListener('resize', updateUnderlinePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateUnderlinePosition)
})
</script>

<template>
  <div class="tabs">
    <div class="tabs-wrapper">
      <div 
        class="tab tab-discover"
        :class="{ 'active': activeTab === 'discover' }"
        @click="handleTabChange('discover')"
      >
        <span class="tab-text">发现</span>
      </div>
      <div 
        class="tab tab-plaza"
        :class="{ 'active': activeTab === 'plaza' }"
        @click="handleTabChange('plaza')"
      >
        <span class="tab-text">广场</span>
      </div>
      <div class="underline" :style="underlineStyle"></div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  height: 80px;
}

.tabs-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
}

.tab {
  width: 120px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.tab-text {
  font-size: 30px;
  font-weight: 400;
  color: #808080;
  transition: color 0.3s ease;
  position: relative;
  z-index: 1;
}

.tab.active .tab-text {
  color: #000;
  font-weight: 500;
}

.underline {
  position: absolute;
  bottom: 15px;
  height: 3px;
  background-color: #FF69B4;
  transition: all 0.3s ease;
  border-radius: 1.5px;
  z-index: 0;
}
</style>
