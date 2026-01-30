<template>
  <div class="relative flex items-center w-full">
    <div
      ref="tabsContainerRef"
      class="flex-1 flex items-center overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div class="flex items-center h-10">
        <div
          v-for="tab in tabs"
          :key="tab.path"
          @click="handleTabClick(tab)"
          class="relative flex items-center gap-2 px-4 h-10 cursor-pointer transition-all duration-200 hover:text-primary whitespace-nowrap"
          :class="
            activeTab === tab.path
              ? 'text-primary bg-gray-100 dark:bg-gray-700'
              : 'text-gray-500 dark:text-gray-400'
          "
        >
          <component :is="getTabIcon(tab.path)" class="w-4 h-4" />
          <span class="text-sm font-medium">{{ tab.title }}</span>

          <button
            v-if="tabs.length > 1"
            @click.stop="handleCloseTab(tab)"
            class="ml-1 p-0.5 rounded-md text-gray-400 hover:text-white hover:bg-red-500 transition-colors"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageTab',
})
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { X } from 'lucide-vue-next'
import { useTabsStore, type TabItem } from '@/stores/modules/tabs'
import { getRouteConfig } from '@/utils/route'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const { tabs, activeTab } = tabsStore

const tabsContainerRef = ref<HTMLElement | null>(null)

watch(
  () => route.path,
  (newPath) => {
    const config = getRouteConfig(newPath)
    if (config) {
      tabsStore.addTab({
        path: newPath,
        title: config.title,
      })
    }
  },
  { immediate: true },
)

// Sync active tab from store to router if needed, or mostly store follows router via watch above
// But if we click a tab, we push router
const handleTabClick = (tab: TabItem) => {
  router.push(tab.path)
}

const handleCloseTab = (tab: TabItem) => {
  const isCurrent = activeTab === tab.path
  tabsStore.removeTab(tab.path)
  if (isCurrent) {
    // Store logic handles setting new active tab, but we need to navigate to it
    router.push(tabsStore.activeTab)
  }
}

const getTabIcon = (path: string) => {
  const config = getRouteConfig(path)
  return config?.icon
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
