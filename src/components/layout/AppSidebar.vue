<script setup lang="ts">
import { ref } from 'vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useRoute, RouterLink } from 'vue-router'
import {
  LayoutDashboard,
  PenTool,
  LayoutGrid,
  Settings,
  Monitor,
  Folder,
  History,
  ChevronDown,
} from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import logo from '@/assets/logo.svg'

const sidebarStore = useSidebarStore()
const route = useRoute()
const sidebarRef = ref(null)

// 关闭侧边栏逻辑
onClickOutside(sidebarRef, () => {
  if (sidebarStore.isSidebarOpen) {
    sidebarStore.setSidebarOpen(false)
  }
})

// 菜单组定义 - 完全同步原作者配置
const menuGroups = [
  {
    name: '',
    items: [
      {
        icon: LayoutDashboard,
        label: '仪表盘',
        route: 'dashboard',
        path: '/',
      },
      {
        icon: PenTool,
        label: '创作',
        route: 'write',
        path: '#',
        children: [
          { label: '谱写', route: 'create', path: '/create' },
          { label: '闪念', route: 'create_record', path: '/create_record' },
          { label: '草稿箱', route: 'draft', path: '/draft' },
          { label: '回收站', route: 'recycle', path: '/decycle' },
        ],
      },
      {
        icon: LayoutGrid,
        label: '管理',
        route: 'manage',
        path: '#',
        children: [
          { label: '文章管理', route: 'article', path: '/article' },
          { label: '助手管理', route: 'assistant', path: '/assistant' },
          { label: '说说管理', route: 'record', path: '/record' },
          { label: '标签管理', route: 'tag', path: '/tag' },
          { label: '评论管理', route: 'comment', path: '/comment' },
          { label: '留言管理', route: 'wall', path: '/wall' },
          { label: '导航管理', route: 'cate', path: '/cate' },
          { label: '网站管理', route: 'web', path: '/web' },
          { label: '轮播图管理', route: 'swiper', path: '/swiper' },
          { label: '足迹管理', route: 'footprint', path: '/footprint' },
          { label: '存储管理', route: 'storage', path: '/storage' },
          { label: '项目配置', route: 'config', path: '/config' },
        ],
      },
      {
        icon: Settings,
        label: '系统',
        route: 'setup',
        path: '/setup',
      },
    ],
  },
  {
    name: 'New',
    items: [
      {
        icon: Monitor,
        label: '工作台',
        route: 'work',
        path: '/work',
      },
      {
        icon: Folder,
        label: '文件系统',
        route: 'file',
        path: '/file',
      },
      {
        icon: History,
        label: '更新日志',
        route: 'iter',
        path: '/iter',
      },
    ],
  },
]

// 处理子菜单展开
const toggleSubMenu = (label: string) => {
  if (sidebarStore.openKeys.includes(label)) {
    sidebarStore.openKeys = sidebarStore.openKeys.filter((k) => k !== label)
  } else {
    sidebarStore.openKeys.push(label)
  }
}

const isSubMenuOpen = (label: string) => sidebarStore.openKeys.includes(label)
</script>

<template>
  <aside
    ref="sidebarRef"
    class="absolute left-0 top-0 z-9999 flex h-screen w-64 flex-col overflow-y-hidden bg-[#1C2434] duration-300 ease-linear lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen,
    }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
      <RouterLink to="/" class="flex items-center gap-3">
        <img :src="logo" alt="Logo" class="w-8 h-8" />
        <span class="text-xl font-semibold text-white">Memory</span>
      </RouterLink>

      <button class="block lg:hidden text-white" @click="sidebarStore.setSidebarOpen(false)">
        <svg
          class="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            fill=""
          />
        </svg>
      </button>
    </div>

    <!-- Menu -->
    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <nav class="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
        <div v-for="(group, index) in menuGroups" :key="index">
          <h3
            v-if="group.name"
            class="mb-4 ml-4 text-sm font-semibold text-gray-400 uppercase tracking-wider"
          >
            {{ group.name }}
          </h3>

          <ul class="mb-6 flex flex-col gap-1.5">
            <li v-for="item in group.items" :key="item.label">
              <!-- Item with Children -->
              <div v-if="item.children">
                <a
                  href="#"
                  class="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark"
                  :class="{
                    'bg-graydark':
                      isSubMenuOpen(item.label) ||
                      item.children.some((c) => route.path.includes(c.path)),
                  }"
                  @click.prevent="toggleSubMenu(item.label)"
                >
                  <component :is="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                  <ChevronDown
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isSubMenuOpen(item.label) }"
                  />
                </a>

                <!-- Submenu -->
                <div
                  class="transform overflow-hidden transition-all duration-300"
                  :class="isSubMenuOpen(item.label) ? 'max-h-[500px] mt-2' : 'max-h-0'"
                >
                  <ul class="flex flex-col gap-2.5 pl-6">
                    <li v-for="child in item.children" :key="child.label">
                      <RouterLink
                        :to="child.path"
                        class="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
                        :class="{ '!text-white': route.path === child.path }"
                      >
                        {{ child.label }}
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Single Item -->
              <RouterLink
                v-else
                :to="item.path"
                class="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark"
                :class="{ 'bg-graydark': route.path === item.path }"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>
