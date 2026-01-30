<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock data (replace with API calls later)
const counts = {
  comment: 0,
  link: 0,
  wall: 0,
}
</script>

<template>
  <div
    class="bg-primary rounded-md p-6 sm:p-10 flex flex-col justify-center h-[170px] relative overflow-hidden mb-4 shadow-md"
  >
    <!-- Right side decoration -->
    <div
      class="absolute right-[-60px] top-[-40px] w-[300px] h-[300px] bg-blue-300 opacity-40 z-0"
      style="border-radius: 60% 40% 60% 40% / 60% 60% 40% 40%"
    />

    <div class="relative z-10">
      <h1 class="text-white text-xl font-bold sm:text-2xl">欢迎使用 Memory 现代化博客管理系统</h1>

      <p class="text-white text-sm mt-2 mb-3">
        当前有 <span class="text-white text-2xl font-bold">{{ counts.comment }}</span> 条评论，
        <span class="text-white text-2xl font-bold">{{ counts.link }}</span> 条友链，
        <span class="text-white text-2xl font-bold">{{ counts.wall }}</span> 条留言。
      </p>

      <button
        class="bg-white text-blue-400 font-bold py-1 px-4 rounded transition duration-300 transform hover:scale-105"
        @click="router.push('/work')"
      >
        去处理
      </button>
    </div>
  </div>
</template>
