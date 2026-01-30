import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = useStorage('sidebar-open', false)
  const selectedKeys = ref<string[]>(['dashboard'])
  const openKeys = ref<string[]>(['write']) // Default open

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function setSidebarOpen(value: boolean) {
    isSidebarOpen.value = value
  }

  return {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    selectedKeys,
    openKeys,
  }
})
