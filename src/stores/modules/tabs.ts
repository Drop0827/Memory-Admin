import { defineStore } from 'pinia'

import { useStorage } from '@vueuse/core'

export interface TabItem {
  path: string
  title: string
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = useStorage<TabItem[]>('tabs', [{ path: '/', title: '首页' }])
  const activeTab = useStorage('activeTab', '/')

  const setActiveTab = (path: string) => {
    activeTab.value = path
  }

  const addTab = (tab: TabItem) => {
    if (tabs.value.some((t) => t.path === tab.path)) {
      setActiveTab(tab.path)
      return
    }
    tabs.value.push(tab)
    setActiveTab(tab.path)
  }

  const removeTab = (path: string) => {
    if (tabs.value.length <= 1) return

    const index = tabs.value.findIndex((t) => t.path === path)
    if (index === -1) return

    if (activeTab.value === path) {
      const newActive = index > 0 ? tabs.value[index - 1] : tabs.value[index + 1]
      if (newActive) setActiveTab(newActive.path)
    }

    tabs.value = tabs.value.filter((t) => t.path !== path)
  }

  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter((t) => t.path === path)
    activeTab.value = path
  }

  const closeAllTabs = () => {
    tabs.value = [{ path: '/', title: '首页' }]
    activeTab.value = '/'
  }

  return {
    tabs,
    activeTab,
    addTab,
    removeTab,
    setActiveTab,
    closeOtherTabs,
    closeAllTabs,
  }
})
