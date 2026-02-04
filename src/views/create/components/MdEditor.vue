<script setup lang="ts">
import { ref } from 'vue'
import { MdEditor, NormalToolbar } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import Material from '@/components/Material/index.vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isMaterialOpen = ref(false)

const editorRef = ref()

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const formData = new FormData()
  formData.append('dir', 'article')

  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const res = await fetch(`${baseURL}/file`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${useUserStore().token}`,
      },
    })

    const result = await res.json()
    if (result.code === 200) {
      callback(result.data)
    } else {
      console.error(result.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const openMaterial = () => {
  isMaterialOpen.value = true
}

// Override default image click behavior?
// MdEditor doesn't easily let us replace the image button action for "select from library".
// It expects `onUploadImg`.
// But we can add a custom tool.
</script>

<template>
  <div class="h-full">
    <MdEditor
      ref="editorRef"
      :model-value="modelValue"
      @update:modelValue="(val) => emit('update:modelValue', val)"
      class="h-full"
      :toolbars-exclude="['github']"
      :on-upload-img="onUploadImg"
    >
      <template #defToolbars>
        <NormalToolbar title="素材库" @onClick="openMaterial">
          <template #trigger>
            <div class="md-editor-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </template>
        </NormalToolbar>
      </template>
    </MdEditor>

    <Material
      :open="isMaterialOpen"
      @update:open="(val) => (isMaterialOpen = val)"
      @select="
        (urls) => {
          const text = urls.map((url) => `![](${url})`).join('\n')
          editorRef?.insert(() => ({
            targetValue: text,
            select: false,
            deviationStart: 0,
            deviationEnd: 0,
          }))
        }
      "
    />
  </div>
</template>

<style>
.md-editor {
  height: 100%;
}
/* 增大编辑区域字号，解决用户反馈字太小的问题 */
.md-editor-content .md-editor-input-wrapper {
  font-size: 16px;
  line-height: 1.8;
}
</style>
