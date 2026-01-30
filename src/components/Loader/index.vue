<script setup lang="ts">
defineOptions({
  name: 'AppLoader',
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-white">
    <div
      class="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
    ></div>
  </div>
</template>
