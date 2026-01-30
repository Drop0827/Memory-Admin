<template>
  <div ref="target" :class="className">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  onClick: () => void
  className?: string
  exceptionRef?: HTMLElement | null
}>()

const target = ref(null)

onClickOutside(
  target,
  () => {
    props.onClick()
  },
  { ignore: props.exceptionRef ? [props.exceptionRef] : [] },
)
</script>
