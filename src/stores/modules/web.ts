import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Web } from '@/types/app/config'

export const useWebStore = defineStore('web', () => {
  const web = ref<Web>({} as Web)

  const setWeb = (data: Web) => {
    web.value = data
  }

  return {
    web,
    setWeb,
  }
})
