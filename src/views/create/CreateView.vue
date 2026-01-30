<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import MdEditor from './components/MdEditor.vue'
import PublishForm from './components/PublishForm.vue'
import Drawer from '@/components/Drawer/index.vue'
import useCreateArticle from '@/composables/useCreateArticle'
import { Save, Send } from 'lucide-vue-next'

const {
  data,
  content,
  publishOpen,
  id,
  isDraftParams,
  init,
  saveToLocal,
  handleNext,
  handleKeyDown,
} = useCreateArticle()

onMounted(() => {
  init()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div>
    <PageTitle title="创作">
      <div class="flex items-center space-x-4 w-[200px]">
        <el-button @click="saveToLocal" :icon="Save"> 保存 </el-button>

        <el-button type="primary" @click="handleNext" :icon="Send" size="large"> 发布 </el-button>
      </div>
    </PageTitle>

    <div
      class="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark mt-2 h-[calc(100vh-160px)] overflow-hidden"
    >
      <MdEditor v-model="content" />
    </div>

    <Drawer
      :title="id && !isDraftParams ? '编辑文章' : '发布文章'"
      v-model="publishOpen"
      width="60%"
    >
      <div class="max-w-4xl mx-auto p-6">
        <PublishForm
          :data="{ ...data, content }"
          :id="id"
          :isDraft="isDraftParams"
          @close="publishOpen = false"
        />
      </div>
    </Drawer>
  </div>
</template>
