import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { User } from '@/types/app/user'
import type { Role } from '@/types/app/role'
import type { Permission } from '@/types/app/permission'

export const useUserStore = defineStore('user', () => {
  const token = useStorage('token', '')
  const user = useStorage<User>('user', {} as User)
  const role = useStorage<Role>('role', {} as Role)
  const permission = useStorage<Permission[]>('permission', [])

  const setToken = (data: string) => {
    token.value = data
  }

  const setUser = (data: User) => {
    user.value = data
  }

  const setRole = (data: Role) => {
    role.value = data
  }

  const setPermission = (data: Permission[]) => {
    permission.value = data
  }

  const quitLogin = () => {
    token.value = ''
    user.value = {} as User
    role.value = {} as Role
    permission.value = []
    localStorage.clear()
    sessionStorage.clear()
    location.href = '/login'
  }

  return {
    token,
    user,
    role,
    permission,
    setToken,
    setUser,
    setRole,
    setPermission,
    quitLogin,
  }
})
