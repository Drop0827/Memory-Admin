<template>
  <div class="flex items-center justify-center" :class="className">
    <div
      v-if="enabled"
      class="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 hover:bg-green-100 transition-colors relative"
    >
      <span
        class="w-2.5 h-2.5 bg-green-500 rounded-full"
        :class="{ 'animate-pulse': flash }"
      ></span>
      <span
        v-if="flash"
        class="absolute w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"
      ></span>
    </div>
    <div
      v-else
      class="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition-colors relative"
    >
      <span class="w-2.5 h-2.5 bg-red-500 rounded-full" :class="{ 'animate-pulse': flash }"></span>
      <span
        v-if="flash"
        class="absolute w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StatusTag',
})
import { computed } from 'vue'

const props = defineProps<{
  status: number | boolean
  className?: string
  flash?: boolean
}>()

const enabled = computed(() => Boolean(props.status))
</script>
