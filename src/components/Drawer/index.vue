<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineOptions({
  name: 'AppDrawer',
})

defineProps<{
  title: string
  modelValue?: boolean // open state
  loading?: boolean
  width?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
    direction="btt"
    size="100%"
    :show-close="false"
    class="custom-drawer"
    :destroy-on-close="true"
  >
    <template #header>
      <div
        class="flex justify-between items-center w-full px-4 py-2 border-b border-gray-100 dark:border-strokedark"
      >
        <div class="w-8"></div>
        <div class="text-lg font-medium text-gray-800 dark:text-white">{{ title }}</div>
        <div
          @click="handleClose"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer group"
        >
          <X class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </template>
    <div v-loading="loading" class="h-full overflow-y-auto">
      <slot></slot>
    </div>
  </el-drawer>
</template>

<style>
.custom-drawer .el-drawer__header {
  padding: 0;
  margin-bottom: 0;
}
.custom-drawer .el-drawer__body {
  padding: 0;
}
</style>
