<template>
  <div>
    <Title value="文件管理" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <div class="flex justify-between mb-4 px-4">
        <div v-if="!fileList.length && !dirName" class="text-4xl text-[#E0DFDF] cursor-default">
          <CornerDownLeft class="w-9 h-9" />
        </div>
        <div v-else class="cursor-pointer" @click="handleReturn">
          <CornerDownLeft class="text-primary w-9 h-9" />
        </div>

        <el-button v-if="dirName" type="primary" @click="openUploadModalOpen = true"
          >上传文件</el-button
        >
      </div>

      <el-spin :spinning="loading">
        <div
          class="flex flex-wrap md:justify-normal overflow-y-auto max-h-[calc(100vh-300px)]"
          :class="dirName ? '!justify-center' : 'justify-start'"
          v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="loading || !hasMore"
          :infinite-scroll-distance="50"
        >
          <template v-if="fileList.length || (!fileList.length && dirName)">
            <div class="w-full masonry-grid">
              <div v-for="(item, index) in fileList" :key="index" class="mb-4 break-inside-avoid">
                <div
                  class="group relative overflow-hidden rounded-md cursor-pointer border-2 hover:!border-primary p-1"
                  :class="
                    file.url === item.url
                      ? 'border-primary'
                      : 'border-gray-100 dark:border-transparent'
                  "
                  @click="viewOpenFileInfo(item)"
                >
                  <el-image :src="item.url" fit="cover" class="w-full rounded-md" loading="lazy">
                    <template #error>
                      <div class="image-slot">
                        <img :src="errorImg" alt="error" />
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, index) in dirList"
              :key="index"
              class="group w-20 flex flex-col items-center cursor-pointer mx-4 my-2"
              @click="openDir(item.name)"
            >
              <img :src="fileSvg" alt="" />
              <p class="group-hover:text-primary transition-colors text-center mt-2">
                {{ item.name }}
              </p>
            </div>
          </template>
        </div>
      </el-spin>
    </el-card>

    <FileUpload
      :multiple="true"
      :dir="dirName"
      :open="openUploadModalOpen"
      @success="handleUploadSuccess"
      @close="openUploadModalOpen = false"
    />

    <el-drawer
      v-model="openFileInfoDrawer"
      title="图片信息"
      size="600px"
      @close="handleDrawerClose"
    >
      <div class="flex flex-col space-y-4">
        <div class="flex">
          <span class="min-w-20 font-bold">文件名称</span>
          <span class="text-[#333] dark:text-white">{{ file.name }}</span>
        </div>
        <div class="flex">
          <span class="min-w-20 font-bold">文件类型</span>
          <span class="text-[#333] dark:text-white">{{ file.type }}</span>
        </div>
        <div class="flex">
          <span class="min-w-20 font-bold">文件大小</span>
          <span class="text-[#333] dark:text-white">{{ (file.size / 1048576).toFixed(2) }}MB</span>
        </div>
        <div class="flex">
          <span class="min-w-20 font-bold">文件链接</span>
          <span
            class="text-[#333] dark:text-white hover:text-primary cursor-pointer transition break-all"
            @click="copyLink(file.url)"
          >
            {{ file.url }}
          </span>
        </div>
      </div>

      <el-divider content-position="center">图片预览</el-divider>
      <div class="flex justify-center">
        <el-image
          :src="file.url"
          class="rounded-md object-cover object-center max-h-[300px]"
          :preview-src-list="[file.url]"
        >
          <template #error>
            <img :src="errorImg" />
          </template>
        </el-image>
      </div>

      <el-divider content-position="center">图片操作</el-divider>
      <div class="flex flex-col gap-2">
        <el-button
          type="primary"
          :loading="downloadLoading"
          @click="onDownloadImage(file)"
          class="w-full"
          >下载图片</el-button
        >
        <el-popconfirm title="删除后无法恢复，确定要删除吗" @confirm="onDeleteImage(file)">
          <template #reference>
            <el-button type="danger" :loading="btnLoading" class="w-full">删除图片</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FileManager',
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CornerDownLeft } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import Title from '@/components/Title/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import { delFileDataAPI, getDirListAPI, getFileListAPI } from '@/api/file'
import type { File, FileDir } from '@/types/app/file'
import fileSvg from './image/file.svg'
import errorImg from './image/error.png'
import { titleSty } from '@/styles/sty'

const loading = ref(false)
const btnLoading = ref(false)
const downloadLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const openUploadModalOpen = ref(false)
const openFileInfoDrawer = ref(false)

const dirList = ref<FileDir[]>([])
const fileList = ref<File[]>([])

const dirName = ref('')
const file = ref<File>({} as File)
const loadingRef = ref(false)

const getDirList = async () => {
  loading.value = true
  try {
    const { data } = await getDirListAPI()
    const defaultDirs = [
      'default',
      'equipment',
      'record',
      'article',
      'footprint',
      'swiper',
      'album',
    ]
    defaultDirs.forEach((dir) => {
      if (!data.some((item: FileDir) => item.name === dir)) {
        data.push({ name: dir, path: '' })
      }
    })
    dirList.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const getFileList = async (dir: string, isLoadMore = false) => {
  if (loadingRef.value) return
  try {
    loadingRef.value = true
    if (!isLoadMore) loading.value = true

    const p = isLoadMore ? page.value + 1 : 1
    const { data } = await getFileListAPI(dir, { page: p, size: 15 })

    if (!isLoadMore) {
      fileList.value = data.result
      page.value = 1
    } else {
      fileList.value.push(...data.result)
      page.value = page.value + 1
    }

    hasMore.value = data.result.length === 15
  } catch (e) {
    console.error(e)
  } finally {
    loadingRef.value = false
    loading.value = false
  }
}

const openDir = (name: string) => {
  dirName.value = name
  getFileList(name)
}

const handleReturn = () => {
  fileList.value = []
  dirName.value = ''
  page.value = 1
  hasMore.value = true
}

const loadMore = () => {
  if (dirName.value && hasMore.value) {
    getFileList(dirName.value, true)
  }
}

const viewOpenFileInfo = (item: File) => {
  file.value = item
  openFileInfoDrawer.value = true
}

const handleDrawerClose = () => {
  file.value = {} as File
}

const copyLink = async (url: string) => {
  await navigator.clipboard.writeText(url)
  ElMessage.success('🎉 复制成功')
}

const onDeleteImage = async (data: File) => {
  try {
    btnLoading.value = true
    await delFileDataAPI(data.url)

    await getFileList(dirName.value)
    ElMessage.success('🎉 删除图片成功')
    file.value = {} as File
    openFileInfoDrawer.value = false
    btnLoading.value = false
  } catch (e) {
    console.error(e)
    btnLoading.value = false
  }
}

const onDownloadImage = (data: File) => {
  downloadLoading.value = true
  fetch(data.url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.download = data.name
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(url)
      link.remove()
    })
    .catch(console.error)
    .finally(() => {
      downloadLoading.value = false
    })
}

const handleUploadSuccess = () => {
  getFileList(dirName.value)
}

onMounted(() => {
  getDirList()
})
</script>

<style scoped>
.masonry-grid {
  column-count: 4;
  column-gap: 1rem;
}
@media (max-width: 1100px) {
  .masonry-grid {
    column-count: 3;
  }
}
@media (max-width: 700px) {
  .masonry-grid {
    column-count: 2;
  }
}
@media (max-width: 500px) {
  .masonry-grid {
    column-count: 1;
  }
}
</style>
