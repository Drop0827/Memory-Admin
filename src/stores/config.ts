import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useConfigStore = defineStore('config', () => {
  const colorMode = useStorage<'light' | 'dark'>('color-mode', 'light')

  function toggleColorMode() {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
    updateBodyClass()
  }

  function setColorMode(mode: 'light' | 'dark') {
    colorMode.value = mode
    updateBodyClass()
  }

  function updateBodyClass() {
    const root = document.documentElement
    if (colorMode.value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Initialize
  updateBodyClass()

  return {
    colorMode,
    toggleColorMode,
    setColorMode,
  }
})
