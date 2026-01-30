<template>
  <div>
    <Title value="回收站" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" align="center" />
        <el-table-column prop="title" label="标题" />
        <el-table-column label="分类" width="150" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.cate" type="info">{{ row.cate?.name || '---' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="恢复文章">
                <el-button link type="primary" @click="handleRestore(row.id)">
                  <template #icon><RotateCcw class="w-4 h-4" /></template>
                </el-button>
              </el-tooltip>
              <el-tooltip content="彻底删除">
                <el-popconfirm title="确定要彻底删除吗？无法恢复！" @confirm="handleDelete(row.id)">
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
  name: 'DecycleBin',
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RotateCcw, Trash2 } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import Title from '@/components/Title/index.vue'
import { getArticleListAPI, delArticleDataAPI, reductionArticleDataAPI } from '@/api/article'
import type { Article } from '@/types/app/article'
import { titleSty } from '@/styles/sty'

const loading = ref(false)
const list = ref<Article[]>([])
const page = ref(1)
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const res = await getArticleListAPI({ query: { isDel: 1 } })
    list.value = res.data || []
    // Mock pagination locally if API returns all
    total.value = list.value.length
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleRestore = async (id: number) => {
  try {
    await reductionArticleDataAPI(id)
    ElMessage.success('🎉 恢复成功')
    getList()
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = async (id: number) => {
  try {
    await delArticleDataAPI(id, true)
    ElMessage.success('🎉 彻底删除成功')
    getList()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  getList()
})
</script>
