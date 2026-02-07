<template>
  <div>
    <Title value="闪念管理" />

    <el-card class="[&>.el-card__body]:!p-3 border-stroke my-2 overflow-scroll">
      <el-form :inline="true" :model="queryForm" class="flex flex-nowrap">
        <el-form-item class="min-w-[200px]">
          <el-input v-model="queryForm.content" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item class="min-w-[250px]">
          <el-date-picker
            v-model="queryForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="选择起始时间"
            end-placeholder="选择结束时间"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onFilterSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="min-h-[calc(100vh-270px)]" :class="titleSty">
      <el-table :data="recordList" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="content" label="内容" min-width="300" align="center">
          <template #default="{ row }">
            <div class="line-clamp-2 text-left">{{ row.content }}</div>
          </template>
        </el-table-column>
        <!-- NOTE: 图片列，仅在有图片时显示内容 -->
        <el-table-column label="图片" width="200" align="center">
          <template #default="{ row }">
            <div v-if="hasImages(row.images)" class="flex space-x-2 justify-center">
              <div v-for="(img, idx) in parseImages(row.images).slice(0, 2)" :key="idx">
                <el-image
                  :src="img"
                  style="width: 50px; height: 50px"
                  class="rounded-lg"
                  fit="cover"
                  :preview-src-list="parseImages(row.images)"
                  :initial-index="idx"
                />
              </div>
              <span
                v-if="parseImages(row.images).length > 2"
                class="text-gray-400 text-sm self-center"
              >
                +{{ parseImages(row.images).length - 2 }}
              </span>
            </div>
            <span v-else class="text-gray-400 text-sm">无图片</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180" sortable :sort-method="sortByDate">
          <template #default="{ row }">
            {{ dayjs(+row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex justify-center space-x-2">
              <el-button link @click="router.push(`/create_record?id=${row.id}`)">
                <template #icon>
                  <FileEdit class="text-primary w-4 h-4" />
                </template>
              </el-button>
              <el-popconfirm title="你确定要删除吗" @confirm="delRecordData(row.id)">
                <template #reference>
                  <el-button link type="danger">
                    <template #icon>
                      <Trash2 class="w-4 h-4" />
                    </template>
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-center mt-4">
        <el-pagination
          layout="prev, pager, next"
          :page-size="8"
          :total="recordList.length"
          hide-on-single-page
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RecordList',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FileEdit, Trash2 } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import Title from '@/components/Title/index.vue'
import { delRecordDataAPI, getRecordListAPI } from '@/api/record'
import type { Record } from '@/types/app/record'
import { titleSty } from '@/styles/sty'

const router = useRouter()
const loading = ref(false)
const recordList = ref<Record[]>([])
const queryForm = reactive({
  content: '',
  createTime: [] as Date[],
})

const getRecordList = async () => {
  loading.value = true
  try {
    const { data } = await getRecordListAPI()
    recordList.value = data as Record[]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onFilterSubmit = async () => {
  loading.value = true
  try {
    const query = {
      key: queryForm.content,
      startDate: queryForm.createTime?.[0]
        ? dayjs(queryForm.createTime[0]).valueOf().toString()
        : undefined,
      endDate: queryForm.createTime?.[1]
        ? dayjs(queryForm.createTime[1]).valueOf().toString()
        : undefined,
    }
    const { data } = await getRecordListAPI({ query })
    recordList.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const delRecordData = async (id: number) => {
  try {
    await delRecordDataAPI(id)
    ElMessage.success('🎉 删除闪念成功')
    getRecordList()
  } catch (e) {
    console.error(e)
  }
}

/**
 * 解析图片 JSON 字符串
 */
const parseImages = (jsonStr: string): string[] => {
  try {
    const result = JSON.parse(jsonStr || '[]')
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

/**
 * 检查是否有图片
 */
const hasImages = (jsonStr: string): boolean => {
  const images = parseImages(jsonStr)
  return images.length > 0
}

const sortByDate = (a: Record, b: Record) => {
  return +a.createTime! - +b.createTime!
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

onMounted(() => {
  getRecordList()
})
</script>
