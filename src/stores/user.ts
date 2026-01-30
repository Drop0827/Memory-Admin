import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { User } from '@/types/app/user'

export const useUserStore = defineStore('user', () => {
  const token = useStorage('token', '')
  const user = useStorage<User>('user', {} as User)

  function setToken(newToken: string) {
    token.value = newToken
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  function quitLogin() {
    token.value = null
    user.value = {} as User
    localStorage.clear() // Clear all strictly
    sessionStorage.clear()
    window.location.href = '/login'
  }

  return {
    token,
    user,
    setToken,
    setUser,
    quitLogin,
  }
})
