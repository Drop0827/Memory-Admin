<template>
  <div class="flex flex-col justify-center items-center h-full text-base">
    <img :src="Empty" alt="" class="w-2/12" /> 空空如也
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppEmpty',
})
import Empty from './empty.svg'
</script>
