<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { User, Settings, LogOut, ChevronDown, Github, Code } from 'lucide-vue-next'

const userStore = useUserStore()
const target = ref(null)
const dropdownOpen = ref(false)

onClickOutside(target, () => {
  dropdownOpen.value = false
})

onMounted(() => {
  // Update user info if it matches old defaults or is empty
  if (!userStore.user.name || userStore.user.name === '宇阳' || userStore.user.name === 'OHH') {
    userStore.setUser({
      ...userStore.user,
      name: 'OH|H',
      // email: '2720751424@qq.com', // Keep existing email or update if requested
      avatar: userStore.user.avatar || 'https://ui-avatars.com/api/?name=OHH&background=random',
      role: {
        id: 1,
        name: '超级管理员',
        mark: 'admin',
        description: 'Super Admin',
      },
    })
  }
})
</script>

<template>
  <div class="relative" ref="target">
    <a class="flex items-center gap-4" href="#" @click.prevent="dropdownOpen = !dropdownOpen">
      <span class="hidden text-right lg:block">
        <span class="block text-sm font-medium text-black dark:text-white">
          {{ userStore.user.name }}
        </span>
        <span class="block text-xs font-medium">超级管理员</span>
      </span>

      <span
        class="h-12 w-12 rounded-full overflow-hidden border border-stroke dark:border-strokedark"
      >
        <img :src="userStore.user.avatar" alt="User" class="object-cover w-full h-full" />
      </span>

      <ChevronDown class="hidden sm:block w-4 h-4 text-bodydark2" />
    </a>

    <!-- Dropdown Start -->
    <div
      v-show="dropdownOpen"
      class="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <ul class="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
        <li>
          <RouterLink
            to="/setup?tab=my"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <User class="w-5 h-5" />
            我的资料
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/setup?tab=web"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <Settings class="w-5 h-5" />
            网站配置
          </RouterLink>
        </li>
        <li>
          <a
            href="https://github.com/Drop0827"
            target="_blank"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <Github class="w-5 h-5" />
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Drop0827/Memory-Admin"
            target="_blank"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <Code class="w-5 h-5" />
            项目地址
          </a>
        </li>
      </ul>
      <button
        class="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        @click="userStore.quitLogin"
      >
        <LogOut class="w-5 h-5" />
        退出登录
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>
