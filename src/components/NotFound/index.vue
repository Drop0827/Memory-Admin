<template>
  <div
    class="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white dark:bg-boxdark rounded-lg shadow-sm border border-stroke dark:border-strokedark"
  >
    <div
      class="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-4"
    >
      404
    </div>
    <div class="text-xl text-gray-600 dark:text-gray-400 mb-8">对不起，您访问的页面不存在</div>
    <div class="flex gap-4">
      <el-button type="primary" size="large" @click="goHome"> 返回首页 </el-button>
      <el-button size="large" @click="handleGithub"> 帮忙点个 Star </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'NotFound',
})
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const handleGithub = () => {
  window.open('https://github.com/LiuYuYang01/ThriveX-Admin', '_blank')
}
</script>
