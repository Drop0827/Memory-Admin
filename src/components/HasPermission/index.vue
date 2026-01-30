<template>
  <slot v-if="hasPermission" />
</template>

<script setup lang="ts">
import { useHasPermission } from '@/utils/permission'

defineOptions({
  name: 'HasPermission',
})

const props = defineProps<{
  code: string
}>()

const hasPermission = useHasPermission(props.code)
</script>
