<template>
  <div
    class="rounded-md border border-stroke py-6 px-7 shadow-default dark:border-transparent bg-light-gradient dark:bg-dark-gradient"
  >
    <h3 class="text-sm text-slate-700 dark:text-white">{{ title }}</h3>

    <div class="flex items-center justify-between">
      <h4 class="font-bold text-2xl my-2 text-black dark:text-white">{{ total }}</h4>

      <div
        class="flex h-11 w-11 items-center justify-center rounded-md bg-[#e7f2fe] dark:bg-[#4e5969]"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'CardDataStats',
})

defineProps<{
  title: string
  total: string
}>()
</script>
