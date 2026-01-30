<template>
  <div>
    <Title value="项目迭代记录" />

    <el-spin :spinning="loading">
      <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
        <div class="flex flex-col items-center mt-2 mb-22">
          <div class="ml-5 mb-6">
            <span class="mr-2">年份切换：</span>
            <el-select v-model="year" size="small" class="w-24">
              <el-option
                v-for="item in yearList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="text-center text-gray-500 py-4">
            (GitHub Calendar - Not available in Vue yet)
          </div>
        </div>

        <div class="overflow-auto w-full">
          <div class="flex w-[1350px] mx-auto">
            <div class="w-[400px]">
              <h3 class="text-xl text-center pb-6 font-bold text-gradient block">Memory-Blog</h3>
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in blog_iterativeRecording"
                  :key="index"
                  :timestamp="item.label"
                  placement="top"
                >
                  {{ item.children }}
                </el-timeline-item>
              </el-timeline>
            </div>
            <div class="w-[400px] mx-[50px]">
              <h3 class="text-xl text-center pb-6 font-bold text-gradient block">Memory-Admin</h3>
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in admin_iterativeRecording"
                  :key="index"
                  :timestamp="item.label"
                  placement="top"
                >
                  {{ item.children }}
                </el-timeline-item>
              </el-timeline>
            </div>
            <div class="w-[400px]">
              <h3 class="text-xl text-center pb-6 font-bold text-gradient block">Memory-Server</h3>
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in server_iterativeRecording"
                  :key="index"
                  :timestamp="item.label"
                  placement="top"
                >
                  {{ item.children }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </el-card>
    </el-spin>
  </div>
</template>

<script lang="ts">
export default {
  name: 'IterativeRecord',
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import Title from '@/components/Title/index.vue'
import { titleSty } from '@/styles/sty'

// Type definition from React code
interface Commit {
  commit: {
    author: { date: string }
    message: string
  }
}

interface TimelineItem {
  label: string
  children: string
}

const loading = ref(false)
const year = ref(new Date().getFullYear())
const yearList = ref<{ value: number; label: string }[]>([])

const blog_iterativeRecording = ref<TimelineItem[]>([])
const admin_iterativeRecording = ref<TimelineItem[]>([])
const server_iterativeRecording = ref<TimelineItem[]>([])

const getCommitData = async (project: string) => {
  try {
    loading.value = true
    const res = await fetch(
      `https://api.github.com/repos/LiuYuYang01/${project}/commits?per_page=10`,
    )
    const data = await res.json()
    const result = data?.map((item: Commit) => ({
      label: dayjs(item.commit.author.date).format('YYYY-MM-DD HH:mm:ss'),
      children: item.commit.message,
    }))

    switch (project) {
      case 'ThriveX-Blog':
        sessionStorage.setItem('blog_project_iterative', JSON.stringify(result))
        blog_iterativeRecording.value = result
        break
      case 'ThriveX-Admin':
        sessionStorage.setItem('admin_project_iterative', JSON.stringify(result))
        admin_iterativeRecording.value = result
        break
      case 'ThriveX-Server':
        sessionStorage.setItem('server_project_iterative', JSON.stringify(result))
        server_iterativeRecording.value = result
        break
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const currentYear = dayjs().year()
  yearList.value = Array.from({ length: 10 }, (_, i) => currentYear - i).map((item) => ({
    value: item,
    label: item + '',
  }))

  // Check cache
  const blog_project_iterative = JSON.parse(
    sessionStorage.getItem('blog_project_iterative') || '[]',
  )
  if (blog_project_iterative.length) blog_iterativeRecording.value = blog_project_iterative
  else getCommitData('ThriveX-Blog')

  const admin_project_iterative = JSON.parse(
    sessionStorage.getItem('admin_project_iterative') || '[]',
  )
  if (admin_project_iterative.length) admin_iterativeRecording.value = admin_project_iterative
  else getCommitData('ThriveX-Admin')

  const server_project_iterative = JSON.parse(
    sessionStorage.getItem('server_project_iterative') || '[]',
  )
  if (server_project_iterative.length) server_iterativeRecording.value = server_project_iterative
  else getCommitData('ThriveX-Server')
})
</script>
