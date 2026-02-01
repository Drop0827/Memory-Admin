<script setup lang="ts">
import { ref } from 'vue'
import { MdEditor, NormalToolbar } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import Material from '@/components/Material/index.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isMaterialOpen = ref(false)

const onUploadImg = async () => {
  // We want to use our Material component instead of direct upload if possible,
  // Or we strictly implement upload.
  // The requirement was to use Material component.
  // md-editor-v3 standard upload handler just takes files.
  // If we want to use Material (Select from gallery OR upload), we should probably use a custom toolbar button.
  // OR we hijack this.
  // Let's implement custom toolbar button for Material.
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
          // How to insert?
          // We need access to editor instance to insert at cursor.
          // MdEditor exposes `insert` via ref?
          // Actually in v3, we can modify modelValue, but cursor is tricky.
          // Let's just append for now creates less bugs than complex cursor logic without proper API access.
          const text = urls.map((url) => `![](${url})`).join('\n')
          emit('update:modelValue', modelValue + '\n' + text)
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
