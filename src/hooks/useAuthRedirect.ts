import { watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores'

const useAuthRedirect = () => {
  const store = useUserStore()
  const router = useRouter()
  const route = useRoute()

  watchEffect(() => {
    const token = store.token
    const isGoingToLogin = route.path === '/login'

    if (isGoingToLogin && token) {
      router.push('/')
    }
  })
}

export default useAuthRedirect
