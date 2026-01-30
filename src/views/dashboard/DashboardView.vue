<template>
  <div>
    <Title value="工作台" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <div class="flex flex-col md:flex-row w-full">
        <div
          class="w-full min-w-[200px] md:w-2/12 md:min-h-96 mb-5 md:mb-0 pr-4 md:border-b-transparent md:border-r border-stroke dark:border-strokedark"
        >
          <ul class="space-y-1">
            <li
              v-for="menu in menus"
              :key="menu.value"
              class="flex items-center w-full py-3 px-4 hover:bg-[#f9f9ff] dark:hover:bg-[#3c5370] hover:text-primary rounded-md text-base cursor-pointer transition-colors"
              :class="active === menu.value ? 'bg-[#f9f9ff] dark:bg-[#3c5370] text-primary' : ''"
              @click="setActive(menu.value)"
            >
              <img :src="menu.icon" alt="" class="w-8 mr-4" />
              <span>{{ menu.label }}</span>
            </li>
          </ul>
        </div>

        <div class="w-full md:w-10/12 md:pl-6 py-4 space-y-10" v-loading="loading">
          <template v-if="currentList.length">
            <ListItem
              v-for="item in currentList"
              :key="item.id"
              :item="item"
              :type="active"
              @refresh="fetchData"
              v-model:loading="loading"
            />
          </template>
          <el-empty v-else description="暂无待办事宜" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import Title from '@/components/Title/index.vue'
import ListItem from './components/List/index.vue'
import { getCommentListAPI } from '@/api/comment'
import { getLinkListAPI } from '@/api/web'
import { getWallListAPI } from '@/api/wall'
import type { Wall } from '@/types/app/wall'
import type { Web } from '@/types/app/web'
import type { Comment } from '@/types/app/comment'
import commentIcon from './image/comment.svg'
import infoIcon from './image/message.svg'
import linkIcon from './image/link.svg'
import { titleSty } from '@/styles/sty'

type Menu = 'comment' | 'link' | 'wall'

const loading = ref(false)
const active = ref<Menu>('comment')
const commentList = ref<Comment[]>([])
const linkList = ref<Web[]>([])
const wallList = ref<Wall[]>([])

const menus = [
  { value: 'comment', label: '评论', icon: commentIcon },
  { value: 'link', label: '友联', icon: linkIcon },
  { value: 'wall', label: '留言', icon: infoIcon },
]

const currentList = computed(() => {
  switch (active.value) {
    case 'comment':
      return commentList.value
    case 'link':
      return linkList.value
    case 'wall':
      return wallList.value
    default:
      return []
  }
})

const fetchData = async (type: Menu = active.value) => {
  try {
    loading.value = true
    if (type === 'comment') {
      const { data } = await getCommentListAPI({ query: { status: 0 }, pattern: 'list' })
      commentList.value = data
    } else if (type === 'link') {
      const { data } = await getLinkListAPI({ query: { status: 0 } })
      linkList.value = data
    } else if (type === 'wall') {
      const { data } = await getWallListAPI({ query: { status: 0 } })
      wallList.value = data
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(active, (val) => {
  fetchData(val)
})

onMounted(() => {
  fetchData()
})

const setActive = (val: string) => {
  active.value = val as Menu
}
</script>
