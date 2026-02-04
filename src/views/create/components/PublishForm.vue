<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type FormInstance, ElMessage } from 'element-plus'
import { addArticleDataAPI, editArticleDataAPI } from '@/api/article'
import { getCateListAPI, addCateDataAPI } from '@/api/cate'
import { getTagListAPI, addTagDataAPI } from '@/api/tag'
import useAssistant from '@/composables/useAssistant'
import Material from '@/components/Material/index.vue'
import { Picture } from '@element-plus/icons-vue'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import dayjs from 'dayjs'

const props = defineProps<{
  data: Article
  isDraft?: boolean
  id?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const { callAssistant } = useAssistant()

const formRef = ref<FormInstance>()
const btnLoading = ref(false)
const generating = ref(false)
const isMaterialModalOpen = ref(false)

const cateList = ref<Cate[]>([])
const tagList = ref<Tag[]>([])
const isEncryptEnabled = ref(false)

// Init form model
const form = reactive({
  title: '',
  description: '',
  cover: '',
  cateIds: [] as number[][], // Cascader expects array of arrays
  tagIds: [] as (number | string)[],
  createTime: new Date(),
  config: {
    top: false,
    status: 'default', // 'default' | 'no_home' | 'hide'
    password: '',
    isEncrypt: false,
  },
})

// Validation rules
const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  cateIds: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  // ...
}

const getCateList = async () => {
  const { data } = await getCateListAPI()
  const list = data as Cate[]

  // 自动检查并创建缺少的分类
  const requiredCates = [
    { name: '开发笔记', mark: 'dev-notes' },
    { name: '生活随笔', mark: 'life' },
    { name: '大学生生活', mark: 'college' },
  ]
  const existingNames = list.map((c) => c.name)
  let changed = false

  for (const item of requiredCates) {
    if (!existingNames.includes(item.name)) {
      try {
        await addCateDataAPI({
          name: item.name,
          mark: item.mark,
          type: 'cate',
          url: '/category/' + item.mark,
          level: 0,
          order: 0,
        } as Cate)
        changed = true
      } catch (e) {
        console.error(`自动创建分类 ${item.name} 失败`, e)
      }
    }
  }

  if (changed) {
    const res = await getCateListAPI()
    cateList.value = (res.data as Cate[]).filter((item) => item.type === 'cate')
  } else {
    cateList.value = list.filter((item) => item.type === 'cate')
  }
}

const getTagList = async () => {
  const { data } = await getTagListAPI()
  tagList.value = data as Tag[]
}

watch(
  () => props.data,
  (newData) => {
    if (!newData || !newData.title) return

    form.title = newData.title
    form.description = newData.description
    form.cover = newData.cover
    form.createTime = newData.createTime ? new Date(Number(newData.createTime)) : new Date()

    // Config
    if (newData.config) {
      form.config.status = newData.config.status
      form.config.password = newData.config.password
      form.config.isEncrypt = !!newData.config.isEncrypt
      form.config.top = false // default not supported? React had commented out code.
      isEncryptEnabled.value = form.config.isEncrypt
    }

    // Tags
    if (newData.tagList) {
      form.tagIds = newData.tagList.map((t) => t.id!)
    }

    // Cates
    // Transform to cascader path: [[1], [parent, child]]
    if (newData.cateList) {
      // This relies on knowing the tree.
      // For simplicity, we assume we just need IDs.
      // But cascader needs full path if we use strict.
      // Element Plus Cascader can bind to leaf nodes with `emitPath: false` maybe?
      // React code did: data?.cateList?.flatMap ...
      // We will try to map loosely or assume backend sends flat categories for now if tree is complex.

      // Replicating React logic:
      const ids = newData.cateList.flatMap((item: Cate) => {
        if (item?.children?.length) {
          return item.children.map((child: Cate) => [item.id!, child.id!])
        } else {
          return [[item.id!]]
        }
      })

      // Fix: Element Plus Cascader binding might need checking.
      // If options are nested, we need to match path.
      form.cateIds = ids as number[][]
    }
  },
  { immediate: true },
)

onMounted(() => {
  getCateList()
  getTagList()
})

const generateTitleAndDescription = async () => {
  if (!props.data.content) {
    ElMessage.error('请先输入文章内容')
    return
  }

  try {
    generating.value = true
    const prompt = `请根据以下文章内容生成一个合适的标题和简短的简介：
文章内容：
${props.data.content.substring(0, 2000)}...

要求：
1. 标题要简洁有力，不超过20个字
2. 简介要概括文章主要内容，不超过100字
3. 返回格式为JSON对象，包含title和description字段`

    interface AiResponse {
      choices?: {
        message?: {
          content?: string
        }
      }[]
    }

    const response = (await callAssistant(
      [
        { role: 'system', content: '你是 Kimi，...' },
        { role: 'user', content: prompt },
      ],
      { max_tokens: 200, temperature: 0.3 },
    )) as AiResponse

    if (response) {
      const content = response.choices?.[0]?.message?.content
      if (content) {
        // Parse JSON
        let jsonStr = content.trim()
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
        }
        const res = JSON.parse(jsonStr)
        form.title = res.title || ''
        form.description = res.description || ''
        ElMessage.success('生成成功')
      }
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('生成失败')
  } finally {
    generating.value = false
  }
}

const onSubmit = async (isDraftSubmition = false) => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        // Handle Tags (create new if not exists)
        const processedTagIds: number[] = []
        for (const item of form.tagIds) {
          if (typeof item === 'string') {
            const existing = tagList.value.find((t) => t.name.toUpperCase() === item.toUpperCase())
            if (existing) {
              processedTagIds.push(existing.id!)
            } else {
              await addTagDataAPI({ name: item })
              const { data } = await getTagListAPI()
              tagList.value = data as Tag[] // refresh
              const newItem = (data as Tag[]).find((t) => t.name === item)
              if (newItem) processedTagIds.push(newItem.id!)
            }
          } else {
            processedTagIds.push(item)
          }
        }

        // Prepare Payload
        const payload = {
          id: props.id,
          title: form.title,
          description: form.description,
          cover: form.cover,
          content: props.data.content, // from props
          tagIds: processedTagIds,
          cateIds: [...new Set(form.cateIds.flat())], // flatten
          createTime: dayjs(form.createTime).valueOf().toString(),
          config: {
            isDraft: isDraftSubmition ? 1 : 0,
            isDel: 0,
            status: form.config.status,
            isEncrypt: form.config.isEncrypt ? 1 : 0,
            password: form.config.password,
          },
        }

        if (props.id && !props.isDraft) {
          // Update existing
          await editArticleDataAPI(payload as unknown as Article)
          ElMessage.success('🎉 编辑成功')
        } else {
          // Create New or Update Draft
          if (!props.isDraft) {
            // New
            await addArticleDataAPI(payload as unknown as Article)
            ElMessage.success(isDraftSubmition ? '🎉 保存为草稿成功' : '🎉 发布成功')
          } else {
            // Update Draft which might become published
            await editArticleDataAPI(payload as unknown as Article)
            ElMessage.success(isDraftSubmition ? '保存成功' : '发布成功')
          }
        }

        emit('close')
        localStorage.removeItem('article_content')
        router.push(isDraftSubmition ? '/draft' : '/article')
      } catch (e) {
        console.error(e)
        ElMessage.error('操作失败')
      } finally {
        btnLoading.value = false
      }
    }
  })
}

const handleMaterialSelect = (urls: string[]) => {
  if (urls.length > 0) {
    form.cover = urls[0] || ''
  }
}
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="文章简介">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入文章简介"
          show-word-limit
          maxlength="200"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain @click="generateTitleAndDescription" :loading="generating"
          >一键生成标题和简介</el-button
        >
      </el-form-item>

      <el-form-item label="文章封面" prop="cover">
        <el-input v-model="form.cover" placeholder="请输入封面链接">
          <template #append>
            <el-button :icon="Picture" @click="isMaterialModalOpen = true" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="选择分类" prop="cateIds">
        <el-cascader
          v-model="form.cateIds"
          :options="cateList"
          :props="{ value: 'id', label: 'name', multiple: true, checkStrictly: false }"
          placeholder="请选择文章分类"
          class="w-full"
          clearable
        />
      </el-form-item>

      <el-form-item label="选择标签">
        <el-select
          v-model="form.tagIds"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择文章标签"
          class="w-full"
        >
          <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="选择发布时间">
        <el-date-picker
          v-model="form.createTime"
          type="datetime"
          placeholder="选择发布时间"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-radio-group v-model="form.config.status">
          <el-radio label="default">正常</el-radio>
          <el-radio label="no_home">不在首页显示</el-radio>
          <el-radio label="hide">全站隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否加密">
        <el-switch v-model="form.config.isEncrypt" />
      </el-form-item>

      <el-form-item v-if="form.config.isEncrypt" label="访问密码" required>
        <el-input v-model="form.config.password" placeholder="请输入访问密码" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="w-full" @click="onSubmit(false)" :loading="btnLoading">
          {{ id && !isDraft ? '编辑文章' : '发布文章' }}
        </el-button>
      </el-form-item>

      <el-form-item v-if="!id || isDraft">
        <el-button class="w-full" @click="onSubmit(true)" :loading="btnLoading">
          {{ isDraft ? '保存' : '保存为草稿' }}
        </el-button>
      </el-form-item>
    </el-form>

    <Material
      :open="isMaterialModalOpen"
      @update:open="(val) => (isMaterialModalOpen = val)"
      @select="handleMaterialSelect"
      :maxCount="1"
    />
  </div>
</template>
