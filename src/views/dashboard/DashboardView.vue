<template>
  <div
    class="dashboard-container p-4 md:p-6 space-y-6 bg-[#f8f9fa] dark:bg-[#121212] min-h-screen text-slate-800 dark:text-slate-200"
  >
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xl">📺</span>
      <h2 class="text-xl font-bold">数据统计</h2>
    </div>

    <!-- 1. 彩色统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 文章 -->
      <div
        class="stat-card bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10 flex justify-between items-start">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl">
            <FileText class="w-8 h-8" />
          </div>
          <div class="text-right">
            <h3 class="text-4xl font-bold text-slate-700 dark:text-slate-100 mb-1 font-mono">
              {{ stats.article.value }}
            </h3>
            <p class="text-sm text-slate-400 dark:text-slate-500 font-medium">文章总计</p>
          </div>
        </div>
      </div>

      <!-- 评论 -->
      <div
        class="stat-card bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10 flex justify-between items-start">
          <div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-xl">
            <MessageSquare class="w-8 h-8" />
          </div>
          <div class="text-right">
            <h3 class="text-4xl font-bold text-slate-700 dark:text-slate-100 mb-1 font-mono">
              {{ stats.comment.value }}
            </h3>
            <p class="text-sm text-slate-400 dark:text-slate-500 font-medium">评论总计</p>
          </div>
        </div>
      </div>

      <!-- 分类 -->
      <div
        class="stat-card bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10 flex justify-between items-start">
          <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl">
            <FolderOpen class="w-8 h-8" />
          </div>
          <div class="text-right">
            <h3 class="text-4xl font-bold text-slate-700 dark:text-slate-100 mb-1 font-mono">
              {{ stats.cate.value }}
            </h3>
            <p class="text-sm text-slate-400 dark:text-slate-500 font-medium">分类总计</p>
          </div>
        </div>
      </div>

      <!-- 友链 -->
      <div
        class="stat-card bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-rose-50 dark:bg-rose-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10 flex justify-between items-start">
          <div class="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-xl">
            <Heart class="w-8 h-8" />
          </div>
          <div class="text-right">
            <h3 class="text-4xl font-bold text-slate-700 dark:text-slate-100 mb-1 font-mono">
              {{ stats.link.value }}
            </h3>
            <p class="text-sm text-slate-400 dark:text-slate-500 font-medium">友链总计</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 核心图表区：趋势图 + 分类分布 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 流量趋势 (8/12) -->
      <div
        class="col-span-12 lg:col-span-8 bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center gap-2 mb-6 text-slate-700 dark:text-slate-200">
          <Activity class="w-5 h-5 text-blue-500" />
          <h3 class="text-lg font-bold">流量趋势</h3>
        </div>
        <div id="chartOne" class="-ml-2">
          <VueApexCharts type="area" height="320" :options="chartOptions" :series="chartSeries" />
        </div>
      </div>

      <!-- 分类占比 (4/12) -->
      <div
        class="col-span-12 lg:col-span-4 bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center gap-2 mb-6 text-slate-700 dark:text-slate-200">
          <PieChart class="w-5 h-5 text-indigo-500" />
          <h3 class="text-lg font-bold">内容分布</h3>
        </div>
        <div class="flex justify-center items-center min-h-[300px]" v-if="pieSeries.length">
          <VueApexCharts type="donut" width="320" :options="pieOptions" :series="pieSeries" />
        </div>
        <div v-else class="text-center text-gray-400 py-20">暂无数据</div>
      </div>
    </div>

    <!-- 3. 工作区：待办事项 + 标签墙 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 待办事项 (7/12) -->
      <div
        class="col-span-12 lg:col-span-7 bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col"
      >
        <div class="flex items-center justify-between mb-4 text-slate-700 dark:text-slate-200">
          <div class="flex items-center gap-2">
            <ListTodo class="w-5 h-5 text-purple-500" />
            <h3 class="text-lg font-bold">待办事项</h3>
          </div>
          <!-- Quick Tabs -->
          <div class="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              v-for="menu in menus"
              :key="menu.value"
              @click="setActive(menu.value)"
              class="px-4 py-1 text-xs font-medium rounded-md transition-all"
              :class="
                active === menu.value
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700'
              "
            >
              {{ menu.label }}
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-1 min-h-[300px]" v-loading="loadingTodo">
          <ListItem
            v-for="item in currentList"
            :key="item.id"
            :item="item"
            :type="active"
            @refresh="fetchTodoData"
            v-model:loading="loadingTodo"
          />
          <div
            v-if="currentList.length === 0"
            class="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60"
          >
            <CheckCircle class="w-12 h-12 stroke-1" />
            <span class="text-sm">暂无待办，喝杯咖啡吧~</span>
          </div>
        </div>
      </div>

      <!-- 标签墙 (5/12) -->
      <div
        class="col-span-12 lg:col-span-5 bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-center gap-2 mb-6 text-slate-700 dark:text-slate-200">
          <Tags class="w-5 h-5 text-orange-500" />
          <h3 class="text-lg font-bold">标签墙</h3>
        </div>
        <div class="flex flex-wrap gap-3 content-start min-h-[300px] max-h-[400px] overflow-y-auto">
          <span
            v-for="tag in tagList"
            :key="tag.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-105 cursor-pointer shadow-sm select-none h-fit"
            :style="{ backgroundColor: getRandomColor(), color: '#555' }"
          >
            {{ tag.name }}
          </span>
          <div v-if="tagList.length === 0" class="w-full text-center text-gray-400 py-20">
            暂无标签
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import {
  FileText,
  FolderOpen,
  Tags,
  MessageSquare,
  Heart,
  Activity,
  PieChart,
  ListTodo,
  CheckCircle,
} from 'lucide-vue-next'
import ListItem from './components/List/index.vue'
import { getCommentListAPI, getCommentPagingAPI } from '@/api/comment'
import { getLinkListAPI, getLinkPagingAPI } from '@/api/web'
import { getWallListAPI } from '@/api/wall'
import { getArticlePagingAPI } from '@/api/article'
import { getCatePagingAPI, getCategoryArticleCountAPI } from '@/api/cate'
import { getTagListAPI } from '@/api/tag'
import { getStatisAPI } from '@/api/statis'
import type { Wall } from '@/types/app/wall'
import type { Web } from '@/types/app/web'
import type { Comment } from '@/types/app/comment'
import type { Tag } from '@/types/app/tag'
import dayjs from 'dayjs'

// --- 顶部统计 ---
const stats = reactive({
  article: { value: 0 },
  comment: { value: 0 },
  cate: { value: 0 },
  link: { value: 0 },
})

// --- 标签墙 ---
const tagList = ref<Tag[]>([])
// 生成柔和的随机背景色 (莫兰迪色系)
const getRandomColor = () => {
  const colors = [
    '#fce4ec',
    '#f3e5f5',
    '#e8eaf6',
    '#e3f2fd',
    '#e0f7fa',
    '#e0f2f1',
    '#e8f5e9',
    '#f1f8e9',
    '#f9fbe7',
    '#fffde7',
    '#fff8e1',
    '#fff3e0',
    '#fbe9e7',
    '#efebe9',
    '#fafafa',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// --- 图表 ---
const chartSeries = ref([
  { name: '访问量 (PV)', data: [] as number[], type: 'area' },
  { name: '访客数 (UV)', data: [] as number[], type: 'line' },
])

const chartOptions = ref<ApexOptions>({
  chart: {
    height: 350,
    type: 'area' as const,
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent',
  },
  colors: ['#4f46e5', '#0ea5e9'],
  stroke: { width: [2, 2], curve: 'smooth' },
  fill: { type: ['gradient', 'solid'], gradient: { opacityFrom: 0.5, opacityTo: 0 } },
  xaxis: {
    type: 'category' as const,
    categories: [] as string[],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8' } },
  },
  yaxis: { labels: { style: { colors: '#94a3b8' } } },
  grid: { strokeDashArray: 4, borderColor: '#e2e8f0' },
  dataLabels: { enabled: false },
})

const pieSeries = ref<number[]>([])
const pieOptions = ref<ApexOptions>({
  chart: { type: 'donut' as const, fontFamily: 'inherit' },
  colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
  labels: [] as string[],
  legend: { show: true, position: 'bottom' },
  plotOptions: { pie: { donut: { size: '55%', labels: { show: false } } } },
  dataLabels: { enabled: false },
  stroke: { show: false },
})

// --- Logic ---
const fetchStatistics = async () => {
  try {
    // 1. 基础计数
    const [articleRes, cateRes, commentRes, linkRes] = await Promise.all([
      getArticlePagingAPI({ pagination: { page: 1, size: 1 } }),
      getCatePagingAPI({ pagination: { page: 1, size: 1 } }),
      getCommentPagingAPI({ pagination: { page: 1, size: 1 } }),
      getLinkPagingAPI({ pagination: { page: 1, size: 1 } }),
    ])

    stats.article.value = articleRes.data?.total || 0
    stats.cate.value = cateRes.data?.total || 0
    stats.comment.value = commentRes.data?.total || 0
    stats.link.value = linkRes.data?.total || 0

    // 2. 标签墙 (获取所有标签)
    const tagRes = await getTagListAPI({})
    if (tagRes.data) {
      tagList.value = tagRes.data
    }

    // 3. 分类饼图
    const cateCountRes = await getCategoryArticleCountAPI()
    if (cateCountRes.data) {
      const data = cateCountRes.data as { name: string; count: number }[]
      pieSeries.value = data.map((item) => item.count)
      pieOptions.value = {
        ...pieOptions.value,
        labels: data.map((item) => item.name),
      }
    }

    // 4. 访问趋势
    const end = dayjs().format('YYYY-MM-DD')
    const start = dayjs().subtract(14, 'day').format('YYYY-MM-DD')
    const statisRes = await getStatisAPI('overview', start, end)

    if (statisRes.data) {
      const data = statisRes.data as {
        date?: string
        day?: string
        pv?: number
        count?: number
        uv?: number
        ip?: number
      }[]
      if (Array.isArray(data)) {
        chartOptions.value = {
          ...chartOptions.value,
          xaxis: {
            ...chartOptions.value.xaxis,
            categories: data.map((item) => item.date || item.day || ''),
          },
        }
        chartSeries.value = [
          {
            name: '访问量 (PV)',
            data: data.map((item) => item.pv || item.count || 0),
            type: 'area',
          },
          {
            name: '访客数 (UV)',
            data: data.map((item) => item.uv || item.ip || 0),
            type: 'line',
          },
        ]
      }
    }
  } catch (e) {
    console.error('Fetch stats error', e)
  }
}

// --- 待办事项逻辑 ---
type Menu = 'comment' | 'link' | 'wall'
const loadingTodo = ref(false)
const active = ref<Menu>('comment')
const commentList = ref<Comment[]>([])
const linkList = ref<Web[]>([])
const wallList = ref<Wall[]>([])
const menus = [
  { value: 'comment', label: '审评论' },
  { value: 'link', label: '审友链' },
  { value: 'wall', label: '审留言' },
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

const fetchTodoData = async (type: Menu = active.value) => {
  try {
    loadingTodo.value = true
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
    loadingTodo.value = false
  }
}

watch(active, (val) => {
  fetchTodoData(val)
})
const setActive = (val: string) => {
  active.value = val as Menu
}

onMounted(() => {
  fetchStatistics()
  fetchTodoData()
})
</script>

<style scoped>
/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
