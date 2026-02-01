<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/PageTitle.vue'
import { Search, Trash2, Download, Upload, Edit } from 'lucide-vue-next'
import {
  getArticlePagingAPI,
  delArticleDataAPI,
  delBatchArticleDataAPI,
  addArticleDataAPI,
  getArticleListAPI,
} from '@/api/article'
import { getCateListAPI } from '@/api/cate'
import { getTagListAPI } from '@/api/tag'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { UploadUserFile } from 'element-plus'
import dayjs from 'dayjs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useWebStore } from '@/stores'
import type { Article, FilterArticle, Status } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import { UploadFilled } from '@element-plus/icons-vue'

// State
const router = useRouter()
const webStore = useWebStore()
const loading = ref(false)
const tableData = ref<Article[]>([])
const total = ref(0)
const cateList = ref<Cate[]>([])
const tagList = ref<Tag[]>([])
const selectedRowKeys = ref<number[]>([])

// Import Modal State
const isModalOpen = ref(false)
const importLoading = ref(false)
const fileList = ref<UploadUserFile[]>([])

// Query Form
const queryForm = reactive({
  title: '',
  cateId: undefined as number | undefined,
  tagId: undefined as number | undefined,
  createTime: [] as string[],
})

// Pagination
const pagination = reactive({
  page: 1,
  size: 8,
})

// Columns definitions (Visual helpers)
const colors = ['', '#2db7f5', '#87d068', '#f50', '#108ee9']

// Lifecycle
onMounted(() => {
  fetchData()
  fetchMeta()
})

// Methods
const url = computed(() => webStore.web?.url || '')

const fetchData = async () => {
  loading.value = true
  try {
    const query: FilterArticle = {
      key: queryForm.title || undefined,
      cateId: queryForm.cateId,
      tagId: queryForm.tagId,
      isDraft: 0,
      isDel: 0,
      startDate: queryForm.createTime?.[0]
        ? dayjs(queryForm.createTime[0]).valueOf() + ''
        : undefined,
      endDate: queryForm.createTime?.[1]
        ? dayjs(queryForm.createTime[1]).valueOf() + ''
        : undefined,
    }

    const { data } = await getArticlePagingAPI({
      pagination: {
        page: pagination.page,
        size: pagination.size,
      },
      query,
    })

    tableData.value = data.result
    total.value = data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchMeta = async () => {
  try {
    const { data: cates } = await getCateListAPI()
    cateList.value = cates.filter((item) => item.type === 'cate')

    const { data: tags } = await getTagListAPI()
    tagList.value = tags
  } catch (error) {
    console.error(error)
  }
}

const handleSelectionChange = (rows: Article[]) => {
  selectedRowKeys.value = rows.map((r) => r.id!)
}

const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这篇文章吗？（可回收）', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await delArticleDataAPI(id, true)
      ElNotification.success('删除成功')
      fetchData()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleBatchDelete = async () => {
  if (!selectedRowKeys.value.length) return ElMessage.warning('请选择要删除的文章')

  ElMessageBox.confirm(`确定要删除选中的 ${selectedRowKeys.value.length} 篇文章吗？`, '批量删除', {
    type: 'warning',
  }).then(async () => {
    loading.value = true
    try {
      const { code } = await delBatchArticleDataAPI(selectedRowKeys.value)
      if (code === 200) {
        ElNotification.success('批量删除成功')
        selectedRowKeys.value = []
        fetchData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}

// ------ Export Logic ------

const generateMarkdown = (article: Article) => {
  const { title, description, content, cover, createTime, cateList, tagList } = article

  const formatDate = (timestamp: string | number) => {
    return dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
  }

  const tags = (tagList || []).map((tag) => tag.name)
  const categories = (cateList || []).map((cate) => cate.name)
  const keywords = [...tags, ...categories].join(' ')

  return `---
title: ${title}
tags: ${tags.join(' ')}
categories: ${categories.join(' ')}
cover: ${cover}
date: ${formatDate(createTime || Date.now())}
keywords: ${keywords}
description: ${description}
---

${content ? content.trim() : ''}`
}

const downloadFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, fileName)
}

const exportArticle = async (id: number) => {
  const article = tableData.value.find((item) => item.id === id)
  if (!article) return
  const markdown = generateMarkdown(article)
  downloadFile(markdown, `${article.title.replace(/[\\/:*?"<>|]/g, '_')}.md`)
}

const downloadMarkdownZip = async (articles: Article[]) => {
  const zip = new JSZip()
  const folder = zip.folder('data')

  articles.forEach((article) => {
    const markdown = generateMarkdown(article)
    const safeTitle = article.title.replace(/[\\/:*?"<>|]/g, '_')
    folder?.file(`${safeTitle}.md`, markdown)
  })

  zip.file('articles.json', JSON.stringify(articles, null, 2))
  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, '导出文章_' + Date.now() + '.zip')
}

const exportSelected = () => {
  const selectedArticles = tableData.value.filter((item) =>
    selectedRowKeys.value.includes(item.id!),
  )
  if (!selectedArticles.length) return ElMessage.warning('请选择要导出的文章')
  downloadMarkdownZip(selectedArticles)
}

const exportAll = async () => {
  loading.value = true
  try {
    const { data } = await getArticleListAPI({})
    await downloadMarkdownZip(data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// ------ Import Logic ------

const getTagIdsByNames = (names: string[]) => {
  const map = new Map<string, number>()
  tagList.value.forEach((t) => map.set(t.name.toLowerCase(), t.id!))
  return names.map((n) => map.get(n.toLowerCase())!).filter((id) => id !== undefined)
}

const parseMarkdownToArticle = (mdText: string): Article => {
  // 提取 frontmatter 块
  const frontmatterMatch = mdText.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch || !frontmatterMatch[1])
    throw new Error('Markdown 文件格式错误，缺少 frontmatter')

  const frontmatterText = frontmatterMatch[1]
  // 去除 frontmatter 后的正文
  const content = mdText.replace(frontmatterMatch[0], '').trim()

  const meta: Record<string, string> = {}

  // 解析 frontmatter 每一行 key: value
  frontmatterText.split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':')
    if (key) meta[key.trim()] = rest.join(':').trim()
  })

  // 时间戳（从 YYYY-MM-DD HH:mm:ss 转为 timestamp）
  const parseDateToTimestamp = (str: string): string => {
    const d = new Date(str)
    if (isNaN(d.getTime())) return Date.now().toString()
    return d.getTime().toString()
  }

  const tagNames = meta.tags?.split(/\s+/).filter(Boolean) || []
  const tagIds = getTagIdsByNames(tagNames)
  const cateNames = meta.categories?.split(/\s+/).filter(Boolean) || []
  // Simplified cate matching (assuming same logic as tags)
  const cateMap = new Map<string, number>()
  cateList.value.forEach((c) => cateMap.set(c.name.toLowerCase(), c.id!))
  const cateIds = cateNames
    .map((n) => cateMap.get(n.toLowerCase())!)
    .filter((id) => id !== undefined)

  const article: Article = {
    title: meta.title || '未命名文章',
    description: meta.description || '',
    content,
    cover: meta.cover || '',
    createTime: parseDateToTimestamp(meta.date || ''),
    cateIds,
    tagIds,
    config: {
      status: 'default',
      password: '',
      isDraft: 0,
      isEncrypt: 0,
      isDel: 0,
    },
  }
  return article
}

interface JsonArticle {
  title?: string
  description?: string
  content?: string
  cover?: string
  createTime?: string
  cateList?: { id: number }[]
  tagList?: { id: number }[]
  config?: {
    status?: string
    password?: string
    isDraft?: number
    isEncrypt?: number
    isDel?: number
  }
}

const parseJsonToArticles = (raw: JsonArticle | JsonArticle[]): Article[] => {
  const parseSingle = (item: JsonArticle): Article => ({
    title: item.title || '未命名文章',
    description: item.description || '',
    content: item.content || '',
    cover: item.cover || '',
    createTime: item.createTime || '',
    cateIds: (item.cateList || [])
      .map((cate) => cate.id)
      .filter((id): id is number => id !== undefined),
    tagIds: (item.tagList || [])
      .map((tag) => tag.id)
      .filter((id): id is number => id !== undefined),
    config: {
      status: (item.config?.status as Status) || 'default',
      password: item.config?.password || '',
      isDraft: item.config?.isDraft || 0,
      isEncrypt: item.config?.isEncrypt || 0,
      isDel: item.config?.isDel || 0,
    },
  })
  return Array.isArray(raw) ? raw.map(parseSingle) : [parseSingle(raw)]
}

const handleImport = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请上传至少一个 .md 或 .json 文件')
    return
  }

  importLoading.value = true
  try {
    const articles: Article[] = []

    for (const fileItem of fileList.value) {
      const file = fileItem.raw as File
      const text = await file.text()

      try {
        if (file.name.endsWith('.md')) {
          const article = parseMarkdownToArticle(text)
          articles.push(article)
        } else if (file.name.endsWith('.json')) {
          const json = JSON.parse(text)
          const batch = parseJsonToArticles(json)
          articles.push(...batch)
        }
      } catch (e: unknown) {
        const err = e as Error
        console.error(`Parsing error for ${file.name}:`, err)
        ElNotification.error({ title: '解析失败', message: `${file.name}: ${err.message}` })
      }
    }

    if (articles.length === 0 && fileList.value.length > 0) {
      // Just return, notification handled above
      return
    }

    let successCount = 0
    for (const article of articles) {
      try {
        const { code } = await addArticleDataAPI(article)
        if (code === 200) {
          successCount++
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(`${article.title}--导入失败`)
      }
    }

    if (successCount > 0) {
      ElNotification.success(`成功导入 ${successCount} 篇文章`)
      fetchData()
      isModalOpen.value = false
      fileList.value = []
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('导入流程发生错误')
  } finally {
    importLoading.value = false
  }
}
</script>

<template>
  <div class="h-full">
    <PageTitle title="文章管理" />

    <!-- Search Card -->
    <div
      class="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <el-form :inline="true" :model="queryForm" class="flex flex-wrap gap-2">
        <el-form-item class="!mb-0">
          <el-input
            v-model="queryForm.title"
            placeholder="请输入关键词"
            :prefix-icon="Search"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item class="!mb-0">
          <el-select
            v-model="queryForm.cateId"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option v-for="c in cateList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item class="!mb-0">
          <el-select
            v-model="queryForm.tagId"
            placeholder="请选择标签"
            clearable
            filterable
            style="width: 150px"
          >
            <el-option v-for="t in tagList" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item class="!mb-0">
          <el-date-picker
            v-model="queryForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item class="!mb-0">
          <el-button
            type="primary"
            @click="
              pagination.page = 1;
              fetchData();
            "
            >筛选</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- Actions & Table Card -->
    <div
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div
        class="py-4 px-4 md:px-6 xl:px-7.5 flex flex-wrap items-center justify-between border-b border-stroke dark:border-strokedark"
      >
        <div class="flex gap-2">
          <el-button type="primary" @click="isModalOpen = true">
            <template #icon><Upload class="w-4 h-4" /></template>
            导入文章
          </el-button>
          <el-dropdown>
            <el-button> 导出文章 <Download class="w-4 h-4 ml-2" /> </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="exportSelected">导出选中</el-dropdown-item>
                <el-dropdown-item @click="exportAll">导出全部</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-popconfirm title="确定删除选中吗？" @confirm="handleBatchDelete">
            <template #reference>
              <el-button type="danger" plain>
                <template #icon><Trash2 class="w-4 h-4" /></template>
                删除选中
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>

      <div class="p-4 md:px-6 xl:px-7.5">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="title" label="标题" min-width="200">
            <template #default="{ row }">
              <a
                :href="`${url}/article/${row.id}`"
                target="_blank"
                class="text-black dark:text-white hover:text-primary font-medium line-clamp-1"
              >
                {{ row.title }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="摘要" min-width="200" show-overflow-tooltip />
          <el-table-column label="分类" width="120">
            <template #default="{ row }">
              <el-tag
                v-for="(cate, index) in row.cateList"
                :key="cate.id"
                size="small"
                :color="colors[index % colors.length]"
                class="text-white border-0"
                >{{ cate.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="标签" width="150">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-1">
                <el-tag
                  v-for="(tag, index) in row.tagList"
                  :key="tag.id"
                  size="small"
                  :color="colors[index % colors.length]"
                  class="text-white border-0"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="view" label="浏览量" width="100" align="center" sortable />
          <el-table-column prop="comment" label="评论" width="80" align="center" sortable />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.config.status === 'default'" type="success" size="small"
                >正常</el-tag
              >
              <el-tag v-else-if="row.config.status === 'hide'" type="info" size="small"
                >隐藏</el-tag
              >
              <el-tag v-else type="warning" size="small">其他</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="180" align="center" sortable>
            <template #default="{ row }">
              {{ dayjs(Number(row.createTime)).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-2">
                <el-button link type="primary" @click="router.push(`/create?id=${row.id}`)">
                  <Edit class="w-4 h-4" />
                </el-button>
                <el-button link type="primary" :title="'导出'" @click="exportArticle(row.id)">
                  <Download class="w-4 h-4" />
                </el-button>
                <el-button link type="danger" @click="handleDelete(row.id)">
                  <Trash2 class="w-4 h-4" />
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="mt-4 flex justify-end">
          <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :total="total"
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :page-sizes="[8, 10, 20, 50]"
            @change="fetchData"
          />
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <el-dialog
      v-model="isModalOpen"
      title="导入文章"
      width="500px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="w-full">
        <el-upload
          v-model:file-list="fileList"
          drag
          action="#"
          multiple
          :auto-upload="false"
          accept=".md,.json"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">仅支持 markdown 或 json 文件</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isModalOpen = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleImport"
            :loading="importLoading"
            :disabled="!fileList.length"
          >
            开始导入
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
