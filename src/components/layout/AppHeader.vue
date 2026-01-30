<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import DarkModeSwitcher from './header/DarkModeSwitcher.vue'
import DropdownUser from './header/DropdownUser.vue'
import { Menu, Bell, MessageSquare } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const sidebarStore = useSidebarStore()

const handleNotification = () => {
  ElMessage.info('通知功能开发中')
}

const handleMessage = () => {
  ElMessage.info('消息功能开发中')
}
</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-light-gradient dark:bg-dark-gradient dark:backdrop-blur-xl drop-shadow-1 dark:drop-shadow-none"
  >
    <div class="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
      <!-- Hamburger & Search (Left) -->
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <button
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          @click.prevent="sidebarStore.toggleSidebar()"
        >
          <Menu class="w-5 h-5 text-bodydark1" />
        </button>
        <router-link to="/" class="block flex-shrink-0 lg:hidden">
          <!-- Small Logo can go here -->
        </router-link>
      </div>

      <!-- Search / Breadcrumb Placeholder -->
      <div class="hidden sm:block">
        <!-- PageTabs / Breadcrumbs could go here -->
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3 2xsm:gap-7 ml-auto">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <!-- Dark Mode Toggle -->
          <DarkModeSwitcher />

          <!-- Notifications -->
          <li class="relative">
            <a
              href="javascript:;"
              class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              @click="handleNotification"
            >
              <span class="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-meta-1">
                <span
                  class="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"
                ></span>
              </span>
              <Bell class="w-5 h-5" />
            </a>
          </li>

          <!-- Messages -->
          <li class="relative">
            <a
              href="javascript:;"
              class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              @click="handleMessage"
            >
              <MessageSquare class="w-5 h-5" />
            </a>
          </li>
        </ul>

        <!-- User Area -->
        <DropdownUser />
      </div>
    </div>
  </header>
</template>
