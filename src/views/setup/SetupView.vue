<template>
  <div>
    <Title value="系统配置" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <div class="flex flex-col md:flex-row">
        <ul
          class="w-full md:w-[20%] md:mr-5 mb-10 md:mb-0 border-b-0 md:border-r border-gray-100 dark:border-strokedark divide-y divide-solid divide-[#F6F6F6] dark:divide-strokedark"
        >
          <li
            v-for="item in list"
            :key="item.key"
            class="relative p-3 pl-5 cursor-pointer transition-all hover:bg-[#f7f7f8] dark:hover:bg-[#3c5370]"
            :class="
              active === item.key
                ? 'bg-[#f7f7f8] dark:bg-[#3c5370] before:content-[\'\'] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3.5px] before:h-full before:bg-[#60a5fa]'
                : ''
            "
            @click="handleTabClick(item.key)"
          >
            <h3 class="flex items-center text-base dark:text-white">
              <component :is="item.icon" class="w-5 h-5 mr-1" />
              {{ item.title }}
            </h3>
            <p class="text-[13px] text-gray-500 mt-1">{{ item.description }}</p>
          </li>
        </ul>

        <div class="w-full md:w-[80%] px-0 md:px-8">
          <System v-if="active === 'system'" />
          <Web v-if="active === 'web'" />
          <Theme v-if="active === 'theme'" />
          <My v-if="active === 'my'" />
          <Other v-if="active === 'other'" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Shield, Globe, Layout, User, Settings } from 'lucide-vue-next'
import Title from '@/components/Title/index.vue'
import System from './components/System/index.vue'
import Web from './components/Web/index.vue'
import Theme from './components/Theme/index.vue'
import My from './components/My/index.vue'
import Other from './components/Other/index.vue'
import { titleSty } from '@/styles/sty'

const route = useRoute()
const router = useRouter()

const list = [
  { title: '账户配置', description: '配置管理员账号、密码等', icon: Shield, key: 'system' },
  { title: '网站配置', description: '配置网站标题、LOGO、描述、SEO等', icon: Globe, key: 'web' },
  { title: '主题配置', description: '配置网站主题风格', icon: Layout, key: 'theme' },
  { title: '个人配置', description: '配置个人信息等', icon: User, key: 'my' },
  { title: '其他设置', description: '杂七八乱的各种配置', icon: Settings, key: 'other' },
]

const validKeys = ['system', 'web', 'theme', 'my', 'other']
const tabFromUrl = computed(() => route.query.tab as string)
const initialActive =
  tabFromUrl.value && validKeys.includes(tabFromUrl.value) ? tabFromUrl.value : 'system'

const active = ref(initialActive)

watch(tabFromUrl, (val) => {
  if (val && validKeys.includes(val)) {
    active.value = val
  }
})

const handleTabClick = (key: string) => {
  active.value = key
  router.replace({ query: { ...route.query, tab: key } })
}
</script>
