<script setup lang="ts">
defineProps<{
  title: string
  total: string
}>()
</script>

<template>
  <div
    class="rounded-md border border-stroke py-6 px-7 shadow-default dark:border-transparent bg-white dark:bg-boxdark"
  >
    <h3 class="text-sm text-slate-700 dark:text-white mb-2">{{ title }}</h3>

    <div class="flex items-center justify-between">
      <h4 class="font-bold text-2xl text-black dark:text-white">{{ total }}</h4>

      <div
        class="flex h-11 w-11 items-center justify-center rounded-md bg-[#e7f2fe] dark:bg-meta-4"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
