<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div
    class="mb-2 rounded-sm border border-stroke bg-white px-4 py-3 shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="flex h-10 items-center justify-between">
      <h2 class="text-xl font-semibold text-black dark:text-white">{{ title }}</h2>
      <div class="flex gap-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
