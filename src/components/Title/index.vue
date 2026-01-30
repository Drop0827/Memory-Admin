<template>
  <el-card class="px-4 mb-2" :class="[titleSty, className]" shadow="never">
    <div class="overflow-auto flex justify-between items-center h-14">
      <h2 class="font-semibold text-black dark:text-white text-xl min-w-24">{{ value }}</h2>
      <slot />
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageSectionTitle',
})
import { titleSty } from '@/styles/sty'

defineProps<{
  value: string
  className?: string
}>()
</script>
