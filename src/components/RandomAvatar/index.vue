<template>
  <img :src="avatar" alt="Avatar" :class="className" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'RandomAvatar',
})

defineProps<{
  className?: string
}>()

const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${Math.random().toString(36).substring(7)}`
</script>
