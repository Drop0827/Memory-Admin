import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

type ColorMode = 'light' | 'dark'

export const useConfigStore = defineStore('config', () => {
  const colorMode = useStorage<ColorMode>('colorMode', 'light')

  const setColorMode = (mode: ColorMode) => {
    colorMode.value = mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    colorMode,
    setColorMode,
  }
})
