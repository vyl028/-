import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showToast } from 'vant'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const page = ref(1)

  const fetchActivities = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const res = await fetch(`/api/activities?page=${page.value}`)
      const data = await res.json()
      activities.value.push(...data.items)
      if (data.items.length < 10) {
        finished.value = true
      }
      page.value++
    } catch (error) {
      showToast('获取活动列表失败')
    } finally {
      loading.value = false
    }
  }

  const refreshActivities = async () => {
    page.value = 1
    activities.value = []
    finished.value = false
    await fetchActivities()
  }

  const getActivityDetail = async (id) => {
    try {
      const res = await fetch(`/api/activities/${id}`)
      return await res.json()
    } catch (error) {
      showToast('获取活动详情失败')
      throw error
    }
  }

  const toggleCollect = async (id) => {
    try {
      const res = await fetch(`/api/activities/${id}/collect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('收藏失败')
    } catch (error) {
      showToast('操作失败')
      throw error
    }
  }

  return {
    activities,
    loading,
    finished,
    fetchActivities,
    refreshActivities,
    getActivityDetail,
    toggleCollect
  }
}) 