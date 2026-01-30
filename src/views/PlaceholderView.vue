<script setup lang="ts">
import PageTitle from '@/components/PageTitle.vue'
</script>

<template>
  <div>
    <PageTitle title="功能建设中" />
    <div
      class="min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-10"
    >
      <div
        class="h-20 w-20 rounded-full bg-gray-100 dark:bg-meta-4 flex items-center justify-center mb-6"
      >
        <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          ></path>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-black dark:text-white mb-2">该模块正在迁移中</h2>
      <p class="text-bodydark">我们正在努力将此功能从 React 迁移到 Vue 3，请稍后回来查看。</p>
    </div>
  </div>
</template>
