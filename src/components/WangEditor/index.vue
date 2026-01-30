<template>
  <div
    class="overflow-hidden border border-stroke rounded-xl z-10 w-full bg-white dark:bg-boxdark dark:border-strokedark"
  >
    <Toolbar
      class="border-b border-stroke dark:border-strokedark"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="min-h-64 overflow-y-hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
// @ts-expect-error Missing module declaration
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

defineOptions({
  name: 'WangEditor',
})

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const mode = 'default'
const editorRef = shallowRef()
const valueHtml = ref(props.modelValue)

const toolbarConfig = {
  excludeKeys: [
    'headerSelect',
    'blockquote',
    'emotion',
    'group-video',
    'group-image',
    'formatPainter',
    'divider',
    'codeBlock',
    'numberedList',
    'bulletedList',
    'todo',
    'fontFamily',
    'fontSize',
    'fontColor',
  ],
}

const editorConfig = {
  placeholder: '记录此刻美好...',
  autoFocus: true,
}

// Watch prop change
watch(
  () => props.modelValue,
  (val) => {
    if (val !== valueHtml.value) {
      valueHtml.value = val
    }
  },
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleChange = (editor: any) => {
  emit('update:modelValue', editor.getHtml())
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
