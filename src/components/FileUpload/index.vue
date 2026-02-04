<script setup lang="ts">
defineOptions({
  name: 'FileUpload',
})
import { ref } from 'vue'
import { Link, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { addExternalFileAPI } from '@/api/file'

const props = defineProps<{
  dir: string
  open: boolean
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'cancel'): void
  (e: 'success', urls: string[]): void
}>()

const imageUrl = ref('')
const isLoading = ref(false)

const handleClose = () => {
  emit('update:open', false)
  emit('cancel')
  imageUrl.value = ''
}

const handleConfirm = async () => {
  if (!imageUrl.value) {
    ElMessage.warning('请输入图片链接')
    return
  }

  try {
    isLoading.value = true
    // Save to backend so it appears in file manager
    await addExternalFileAPI(props.dir || 'default', imageUrl.value)

    emit('success', [imageUrl.value])
    ElMessage.success('链接已添加')
    handleClose()
  } catch (e) {
    console.error(e)
    ElMessage.error('保存链接失败')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <el-dialog
    title="插入图片链接"
    :model-value="open"
    @update:model-value="(val: boolean) => emit('update:open', val)"
    width="500px"
    @close="handleClose"
    align-center
    append-to-body
  >
    <div v-loading="isLoading" class="flex flex-col gap-4">
      <el-alert
        title="当前已配置为使用外部图床，请直接输入图片链接"
        type="info"
        show-icon
        :closable="false"
      />

      <el-input
        v-model="imageUrl"
        placeholder="请输入图片链接 (例如: https://example.com/image.png)"
        clearable
        @keyup.enter="handleConfirm"
      >
        <template #prefix>
          <el-icon><Link /></el-icon>
        </template>
      </el-input>

      <div v-if="imageUrl" class="border rounded p-2 bg-gray-50 flex flex-col items-center">
        <span class="text-xs text-gray-500 mb-2 w-full text-left">预览:</span>
        <el-image
          :src="imageUrl"
          fit="contain"
          class="max-h-60 w-full rounded"
          :preview-src-list="[imageUrl]"
        >
          <template #error>
            <div
              class="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-100 w-full rounded"
            >
              <el-icon class="text-2xl mb-2"><Picture /></el-icon>
              <span class="text-sm">无法加载预览</span>
            </div>
          </template>
        </el-image>
      </div>

      <div class="flex justify-end mt-2">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="!imageUrl">
          确认插入
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
