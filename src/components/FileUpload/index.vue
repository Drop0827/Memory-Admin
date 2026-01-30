<script setup lang="ts">
defineOptions({
  name: 'FileUpload',
})
import { ref } from 'vue'
import { Inbox } from 'lucide-vue-next'
import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'
import { ElMessage } from 'element-plus'

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

const store = useUserStore()
const fileInputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const isDragging = ref(false)
const dragCounter = ref(0)
const isCompressionUpload = ref(false)
const quality = ref(1)

const handleClose = () => {
  emit('update:open', false)
  emit('cancel')
  isDragging.value = false
  dragCounter.value = 0
}

const onUploadFile = async (files: File[]) => {
  try {
    isLoading.value = true

    const formData = new FormData()
    formData.append('dir', props.dir || 'default')

    // Skip compression for now as compressorjs is missing
    files.forEach((file) => {
      formData.append('files', file)
    })

    const res = await fetch(`${baseURL}/file`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    })

    const result = await res.json()
    if (result.code !== 200) {
      throw new Error(result.message || '上传失败')
    }

    // Attempt to copy to clipboard (optional)
    try {
      await navigator.clipboard.writeText(result.data.join('\n'))
      ElMessage.success('上传成功，URL已复制到剪贴板')
    } catch {
      ElMessage.success('上传成功')
    }

    emit('success', result.data)
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : ''
    ElMessage.error(message || '文件上传失败')
  } finally {
    isLoading.value = false
  }
}

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    onUploadFile(Array.from(target.files))
  }
}

// Drag & Drop
const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragCounter.value++
  if (dragCounter.value === 1) {
    isDragging.value = true
  }
}
const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragCounter.value--
  if (dragCounter.value === 0) {
    isDragging.value = false
  }
}
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}
const onDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
  dragCounter.value = 0
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    onUploadFile(Array.from(e.dataTransfer.files))
  }
}

const triggerSelect = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <el-dialog
    title="文件上传"
    :model-value="open"
    @update:model-value="(val: boolean) => emit('update:open', val)"
    width="500px"
    @close="handleClose"
    align-center
    append-to-body
  >
    <div v-loading="isLoading">
      <div class="mb-4 flex items-center gap-4">
        <el-radio-group v-model="isCompressionUpload">
          <el-radio :value="false">无损上传</el-radio>
          <el-radio :value="true" disabled title="暂时不可用">压缩上传 (暂未支持)</el-radio>
        </el-radio-group>

        <el-select
          v-if="isCompressionUpload"
          v-model="quality"
          placeholder="压缩质量"
          size="small"
          style="width: 120px"
        >
          <el-option label="轻量压缩" :value="1" />
          <el-option label="0.8" :value="0.8" />
          <el-option label="0.5" :value="0.5" />
        </el-select>
      </div>

      <div
        @click="triggerSelect"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @drop="onDrop"
        class="w-full h-40 border-2 border-dashed rounded-lg transition-colors duration-300 flex flex-col items-center justify-center cursor-pointer gap-2"
        :class="
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary bg-gray-50'
        "
      >
        <Inbox class="w-10 h-10 text-gray-400" :class="{ 'text-primary': isDragging }" />
        <p class="text-gray-600 text-sm">
          {{ isDragging ? '释放文件以开始上传' : '点击或拖拽文件到此处上传' }}
        </p>
        <p class="text-xs text-gray-400">支持批量上传</p>
      </div>

      <input
        type="file"
        ref="fileInputRef"
        class="hidden"
        :multiple="multiple"
        @change="handleFileInput"
      />
    </div>
  </el-dialog>
</template>
