<template>
  <div>
    <Title value="留言管理" />

    <el-card class="[&>.el-card__body]:!p-3 border-stroke my-2 overflow-scroll">
      <el-form :inline="true" :model="queryForm" class="flex flex-nowrap">
        <el-form-item class="min-w-[200px]">
          <el-input v-model="queryForm.content" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item class="min-w-[200px]">
          <el-select v-model="queryForm.cateId" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="ID" width="120" align="center" />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag :color="row.cate.color" effect="dark" class="border-none text-white">{{
              row.cate.name
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column label="内容" width="400">
          <template #default="{ row }">
            <span class="hover:text-primary cursor-pointer line-clamp-2" @click="openDetail(row)">
              {{ row.content }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="180">
          <template #default="{ row }">
            {{ row.email || '暂无邮箱' }}
          </template>
        </el-table-column>
        <el-table-column label="留言时间" sortable :sort-method="sortByDate">
          <template #default="{ row }">
            {{ dayjs(+row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex justify-center space-x-2">
              <el-button link @click="toggleChoice(row)">
                <template #icon>
                  <Star v-if="row.isChoice === 1" class="text-yellow-400 fill-yellow-400 w-4 h-4" />
                  <Star v-else class="w-4 h-4" />
                </template>
              </el-button>
              <el-button link @click="openReply(row)">
                <template #icon>
                  <Send class="text-primary w-4 h-4" />
                </template>
              </el-button>
              <el-popconfirm title="你确定要删除吗" @confirm="delWallData(row.id)">
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
          :total="list.length"
          hide-on-single-page
        />
      </div>
    </el-card>

    <el-dialog v-model="isModalOpen" title="留言详情" width="500px">
      <div class="space-y-4 py-2">
        <div>
          <span class="font-bold">留言时间：</span>
          {{ dayjs(+wall.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
        <div>
          <span class="font-bold">留言用户：</span>
          {{ wall.name }}
        </div>
        <div>
          <span class="font-bold">内容：</span>
          {{ wall.content }}
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="isReplyModalOpen" title="回复留言" width="500px">
      <el-input
        v-model="replyInfo"
        type="textarea"
        placeholder="请输入回复内容"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
      <template #footer>
        <el-button @click="isReplyModalOpen = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onHandleReply">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WallList',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Trash2, Star, Send } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import Title from '@/components/Title/index.vue'
import { useWebStore } from '@/stores'
import { getWallListAPI, delWallDataAPI, getWallCateListAPI, updateChoiceAPI } from '@/api/wall'
import { sendReplyWallEmailAPI } from '@/api/email'
import type { Cate, Wall } from '@/types/app/wall'
import { titleSty } from '@/styles/sty'

const webStore = useWebStore()
const web = computed(() => webStore.web)

const loading = ref(false)
const list = ref<Wall[]>([])
const cateList = ref<Cate[]>([])
const wall = ref<Wall>({} as Wall)

const isModalOpen = ref(false)
const isReplyModalOpen = ref(false)
const replyInfo = ref('')

const queryForm = reactive({
  content: '',
  cateId: undefined as number | undefined,
  createTime: [] as Date[],
})

const getWallList = async () => {
  loading.value = true
  try {
    const { data } = await getWallListAPI()
    list.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const getCateList = async () => {
  const { data } = await getWallCateListAPI()
  cateList.value = (data as Cate[]).filter((item) => item.id !== 1)
}

const delWallData = async (id: number) => {
  loading.value = true
  try {
    await delWallDataAPI(id)
    ElMessage.success('🎉 删除留言成功')
    getWallList()
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
      cateId: queryForm.cateId,
      startDate: queryForm.createTime?.[0]
        ? dayjs(queryForm.createTime[0]).valueOf().toString()
        : undefined,
      endDate: queryForm.createTime?.[1]
        ? dayjs(queryForm.createTime[1]).valueOf().toString()
        : undefined,
    }
    const { data } = await getWallListAPI({ query })
    list.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const toggleChoice = async (row: Wall) => {
  loading.value = true
  try {
    await updateChoiceAPI(row.id)
    ElMessage.success('🎉 操作成功')
    getWallList()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openReply = (row: Wall) => {
  wall.value = row
  isReplyModalOpen.value = true
}

const openDetail = (row: Wall) => {
  wall.value = row
  isModalOpen.value = true
}

const onHandleReply = async () => {
  loading.value = true
  try {
    await sendReplyWallEmailAPI({
      to: wall.value.email,
      recipient: wall.value.name,
      your_content: wall.value.content,
      reply_content: replyInfo.value,
      time: dayjs(+wall.value.createTime).format('YYYY-MM-DD HH:mm:ss'),
      url: web.value.url + '/wall/all',
    })
    ElMessage.success('🎉 回复留言成功')
    isReplyModalOpen.value = false
    replyInfo.value = ''
    getWallList()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const sortByDate = (a: Wall, b: Wall) => {
  return +a.createTime! - +b.createTime!
}

onMounted(() => {
  getWallList()
  getCateList()
})
</script>
