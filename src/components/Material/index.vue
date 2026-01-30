<script setup lang="ts">
defineOptions({
  name: 'MaterialLibrary',
})
import { ref, onMounted } from 'vue'
import { getDirListAPI, getFileListAPI } from '@/api/file'
import type { File, FileDir } from '@/types/app/file'
import FileUpload from '@/components/FileUpload/index.vue'
import { CornerUpLeft, Check } from 'lucide-vue-next'
import errorImg from '@/assets/images/error.png'
import fileSvg from '@/assets/images/file.svg'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  open: boolean
  multiple?: boolean
  maxCount?: number
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'select', urls: string[]): void
}>()

const loading = ref(false)
const fileList = ref<File[]>([])
const dirList = ref<FileDir[]>([])
const currentDir = ref('')
const page = ref(1)
const hasMore = ref(true)
const selectedFiles = ref<File[]>([])
const isUploadOpen = ref(false)

// Masonry layout using CSS columns logic (simple version)
// For actual masonry behavior we can use a library, but CSS columns work well for simple image grids
// Or we can just use a flex grid.
// Given React used masonry, columns is best approximation without JS lib.

const getDirs = async () => {
  try {
    loading.value = true
    const res = await getDirListAPI()
    // Response is BaseResponse<FileDir[]>
    const data = res.data || []

    // Ensure default dirs exist
    const defaults = ['default', 'equipment', 'record', 'article', 'footprint', 'swiper', 'album']
    defaults.forEach((d) => {
      if (!data.some((item: FileDir) => item.name === d)) {
        data.push({ name: d, path: '' })
      }
    })
    dirList.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const getFiles = async (dir: string, loadMore = false) => {
  if (loadMore && !hasMore.value) return

  try {
    loading.value = true
    const p = loadMore ? page.value + 1 : 1
    const paging = { page: p, size: 15 }
    const res = await getFileListAPI(dir, paging)
    const data = res.data

    if (loadMore) {
      fileList.value.push(...data.result)
      page.value = p
    } else {
      fileList.value = data.result
      page.value = 1
    }

    hasMore.value = data.result.length === 15
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openDir = (dirName: string) => {
  currentDir.value = dirName
  getFiles(dirName)
}

const goBack = () => {
  currentDir.value = ''
  fileList.value = []
  selectedFiles.value = [] // Optional: clear selection on back? React version cleared it: reset() calls setDirName('')
}

const reset = () => {
  currentDir.value = ''
  fileList.value = []
  selectedFiles.value = []
}

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  if (
    target.scrollHeight - target.scrollTop - target.clientHeight < 50 &&
    hasMore.value &&
    !loading.value
  ) {
    getFiles(currentDir.value, true)
  }
}

const toggleSelect = (file: File) => {
  const index = selectedFiles.value.findIndex((f) => f.url === file.url)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    if (!props.multiple && props.maxCount !== 1) {
      // Logic from React: const isMultiple = multiple || (maxCount !== undefined && maxCount !== 1);
      // If not multiple, replace
      selectedFiles.value = [file]
    } else {
      // Multiple allowed
      if (props.maxCount && selectedFiles.value.length >= props.maxCount) {
        ElMessage.warning(`最多只能选择 ${props.maxCount} 个文件`)
        return
      }
      selectedFiles.value.push(file)
    }
  }
}

const isSelected = (file: File) => selectedFiles.value.some((f) => f.url === file.url)

const confirmSelect = () => {
  emit(
    'select',
    selectedFiles.value.map((f) => f.url),
  )
  handleClose()
}

const handleClose = () => {
  emit('update:open', false)
  emit('close')
  reset()
}

const onUploadSuccess = (urls: string[]) => {
  isUploadOpen.value = false
  emit('select', urls)
  handleClose()
}

onMounted(() => {
  getDirs()
})

const onHandleCancel = () => {
  handleClose()
}
</script>

<template>
  <el-dialog
    title="素材库"
    :model-value="open"
    @update:model-value="(val: boolean) => emit('update:open', val)"
    width="1200px"
    top="5vh"
    @close="handleClose"
    align-center
    append-to-body
    class="material-modal"
  >
    <div class="flex justify-between mb-4 px-4 items-center">
      <div
        @click="currentDir ? goBack() : null"
        class="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-boxdark-2 transition-colors"
      >
        <CornerUpLeft
          class="w-8 h-8 transition-colors"
          :class="currentDir ? 'text-primary' : 'text-gray-300 cursor-not-allowed'"
        />
      </div>

      <div v-if="currentDir">
        <el-button type="primary" @click="isUploadOpen = true">上传文件</el-button>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="h-[60vh] overflow-y-auto px-4 custom-scrollbar"
      @scroll="handleScroll"
      v-loading="loading"
    >
      <!-- Dir List -->
      <div v-if="!currentDir" class="flex flex-wrap gap-4">
        <div
          v-for="item in dirList"
          :key="item.name"
          class="flex flex-col items-center cursor-pointer p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-boxdark-2 transition-all group w-32"
          @click="openDir(item.name)"
        >
          <img :src="fileSvg" class="w-16 h-16 mb-2 group-hover:scale-110 transition-transform" />
          <span class="text-gray-700 dark:text-gray-300 group-hover:text-primary">{{
            item.name
          }}</span>
        </div>
      </div>

      <!-- File List (Masonry-like with CSS columns) -->
      <div v-else class="masonry-grid">
        <div
          v-for="(item, index) in fileList"
          :key="index"
          class="break-inside-avoid mb-4 relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all"
          :class="isSelected(item) ? 'border-primary' : 'border-transparent hover:border-primary'"
          @click="toggleSelect(item)"
        >
          <img
            :src="item.url"
            loading="lazy"
            class="w-full h-auto block"
            @error="(e) => ((e.target as HTMLImageElement).src = errorImg)"
          />

          <div
            v-if="isSelected(item)"
            class="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
          >
            <Check class="w-4 h-4" />
          </div>
        </div>
      </div>

      <div
        v-if="currentDir && fileList.length === 0 && !loading"
        class="flex justify-center items-center h-full text-gray-400"
      >
        暂无文件
      </div>
    </div>

    <template #footer>
      <div v-if="currentDir" class="dialog-footer">
        <el-button @click="onHandleCancel">取消</el-button>
        <el-button type="primary" @click="confirmSelect" :disabled="selectedFiles.length === 0">
          选择 ({{ selectedFiles.length }})
        </el-button>
      </div>
    </template>

    <FileUpload
      :open="isUploadOpen"
      :dir="currentDir"
      :multiple="multiple"
      @update:open="(val: boolean) => (isUploadOpen = val)"
      @success="onUploadSuccess"
      @cancel="isUploadOpen = false"
    />
  </el-dialog>
</template>

<style scoped>
.masonry-grid {
  column-count: 4;
  column-gap: 1rem;
}
.break-inside-avoid {
  break-inside: avoid;
}
@media (max-width: 1024px) {
  .masonry-grid {
    column-count: 3;
  }
}
@media (max-width: 768px) {
  .masonry-grid {
    column-count: 2;
  }
}
@media (max-width: 480px) {
  .masonry-grid {
    column-count: 1;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
