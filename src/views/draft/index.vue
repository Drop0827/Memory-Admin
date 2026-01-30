<template>
  <div>
    <Title value="草稿箱" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" align="center" />
        <el-table-column prop="title" label="标题" />
        <el-table-column label="分类" width="150" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.cate" type="success">{{ row.cate?.name || '---' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="编辑文章">
                <el-button link type="primary" @click="handleEdit(row.id)">
                  <template #icon><FileEdit class="w-4 h-4" /></template>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除草稿">
                <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row.id)">
                  <template #reference>
                    <el-button link type="danger">
                      <template #icon><Trash2 class="w-4 h-4" /></template>
                    </el-button>
                  </template>
                </el-popconfirm>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-center mt-4" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          :page-size="10"
          layout="prev, pager, next"
          :total="total"
          @current-change="getList"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DraftList',
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FileEdit, Trash2 } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import Title from '@/components/Title/index.vue'
import { getArticleListAPI, delArticleDataAPI } from '@/api/article'
import type { Article } from '@/types/app/article'
import { titleSty } from '@/styles/sty'

const router = useRouter()
const loading = ref(false)
const list = ref<Article[]>([])
const page = ref(1)
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const res = await getArticleListAPI({ query: { isDraft: 1 } })
    list.value = res.data || []
    total.value = list.value.length
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleEdit = (id: number) => {
  router.push(`/create?id=${id}`)
}

const handleDelete = async (id: number) => {
  try {
    await delArticleDataAPI(id) // Soft delete to recycle bin first usually
    ElMessage.success('🎉 删除成功')
    getList()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  getList()
})
</script>
