<template>
  <div>
    <Title value="足迹管理">
      <el-button type="primary" size="large" @click="addFootprintData">新增足迹</el-button>
    </Title>

    <el-card class="mt-2" :class="titleSty">
      <el-form :inline="true" :model="queryForm" class="flex flex-nowrap w-full">
        <el-form-item class="min-w-[200px]">
          <el-input v-model="queryForm.address" placeholder="请输入关键词" />
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

    <el-card class="mt-2 min-h-[calc(100vh-270px)]" :class="titleSty">
      <el-table
        :data="footprintList"
        v-loading="loading"
        style="width: 100%"
        max-height="calc(100vh - 350px)"
      >
        <el-table-column prop="id" label="ID" width="120" align="center" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="address" label="地址" width="250" />
        <el-table-column prop="content" label="内容" width="400">
          <template #default="{ row }">
            <div class="line-clamp-3">{{ row.content || '---' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="坐标纬度" width="170" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.position }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" sortable :sort-method="sortByDate">
          <template #default="{ row }">
            {{ dayjs(+row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex justify-center space-x-2">
              <el-button link @click="editFootprintData(row)">
                <template #icon>
                  <FileEdit class="text-primary w-4 h-4" />
                </template>
              </el-button>
              <el-popconfirm title="你确定要删除吗" @confirm="delFootprintData(row.id)">
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
          v-model:current-page="page"
          :page-size="8"
          layout="prev, pager, next"
          :total="footprintList.length"
          hide-on-single-page
        />
      </div>
    </el-card>

    <el-dialog
      v-model="isModelOpen"
      :title="isMethod === 'edit' ? '编辑足迹' : '新增足迹'"
      width="600px"
      @close="closeModel"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="地名/地址" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入地名或地址"
            @keydown.enter.prevent="getGeocode"
            @blur="getGeocode"
          >
            <template #append>
              <el-button :loading="geoLoading" @click="getGeocode">
                <Search class="w-4 h-4" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="坐标纬度" prop="position">
          <el-input v-model="form.position" placeholder="系统自动生成" readonly>
            <template #prefix>
              <MapPin class="w-4 h-4" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <div class="relative w-full">
            <el-input
              v-model="form.images"
              type="textarea"
              placeholder="请输入图片链接"
              :autosize="{ minRows: 2, maxRows: 10 }"
            />
            <div
              @click="isMaterialModalOpen = true"
              class="absolute bottom-2 right-2 bg-white rounded-full border border-gray-200 cursor-pointer p-1 z-10"
            >
              <UploadCloud class="text-xl hover:text-primary transition-colors text-gray-500" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入内容"
            :autosize="{ minRows: 5, maxRows: 10 }"
          />
        </el-form-item>
        <el-form-item label="时间" prop="createTime" class="w-full">
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            placeholder="请选择时间"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeModel">取消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="onSubmit">
            {{ isMethod === 'edit' ? '编辑足迹' : '新增足迹' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <Material
      :multiple="true"
      :open="isMaterialModalOpen"
      @close="isMaterialModalOpen = false"
      @select="handleMaterialSelect"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FootprintList',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { FileEdit, Trash2, MapPin, Search, UploadCloud } from 'lucide-vue-next'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import dayjs, { type Dayjs } from 'dayjs'
import axios from 'axios'
import Title from '@/components/Title/index.vue'
import Material from '@/components/Material/index.vue'
import {
  delFootprintDataAPI,
  getFootprintListAPI,
  addFootprintDataAPI,
  editFootprintDataAPI,
  getFootprintDataAPI,
} from '@/api/footprint'
import { getEnvConfigDataAPI } from '@/api/config'
import type { Footprint } from '@/types/app/footprint' // check path
import { titleSty } from '@/styles/sty'

const loading = ref(false)
const btnLoading = ref(false)
const footprintList = ref<Footprint[]>([])
const gaodeApKey = ref('')
const isModelOpen = ref(false)
const isMaterialModalOpen = ref(false)
const isMethod = ref<'create' | 'edit'>('create')
const page = ref(1)
const formRef = ref<FormInstance>()

const queryForm = reactive({
  address: '',
  createTime: [] as Date[],
})

const form = reactive({
  title: '',
  address: '',
  position: '',
  images: '',
  content: '',
  createTime: undefined as string | number | Date | Dayjs | null | undefined,
})

const currentId = ref<number | undefined>(undefined)

const rules = reactive<FormRules>({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
  position: [{ required: true, message: '坐标纬度不能为空', trigger: 'blur' }],
  createTime: [{ required: true, message: '时间不能为空', trigger: 'change' }],
})

const getEnvConfigData = async () => {
  const { data } = await getEnvConfigDataAPI('gaode_coordinate')
  gaodeApKey.value = (data.value as { key: string }).key
}

const getFootprintList = async () => {
  loading.value = true
  try {
    const { data } = await getFootprintListAPI()
    footprintList.value = data as Footprint[]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getEnvConfigData()
  getFootprintList()
})

const addFootprintData = () => {
  isMethod.value = 'create'
  isModelOpen.value = true
  currentId.value = undefined
  resetForm()
}

const editFootprintData = async (row: Footprint) => {
  isMethod.value = 'edit'
  isModelOpen.value = true
  currentId.value = row.id

  // Fetch details? React calls getFootprintDataAPI(id)
  try {
    const { data } = await getFootprintDataAPI(row.id!)
    form.title = data.title
    form.address = data.address
    form.position = data.position
    form.images = (data.images as string[]).join('\n')
    form.content = data.content
    form.createTime = dayjs(+data.createTime!).toDate()
  } catch (e) {
    console.error(e)
  }
}

const delFootprintData = async (id: number) => {
  loading.value = true
  try {
    await delFootprintDataAPI(id)
    ElMessage.success('🎉 删除足迹成功')
    getFootprintList()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        const values = {
          ...form,
          createTime: dayjs(form.createTime).valueOf().toString(),
          images: form.images ? form.images.split('\n') : [],
        }

        if (isMethod.value === 'edit' && currentId.value) {
          await editFootprintDataAPI({ ...values, id: currentId.value } as unknown as Footprint)
          ElMessage.success('🎉 修改足迹成功')
        } else {
          await addFootprintDataAPI(values as unknown as Footprint)
          ElMessage.success('🎉 新增足迹成功')
        }
        closeModel()
        getFootprintList()
      } catch (e) {
        console.error(e)
      } finally {
        btnLoading.value = false
      }
    }
  })
}

const closeModel = () => {
  isModelOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.title = ''
  form.address = ''
  form.position = ''
  form.images = ''
  form.content = ''
  form.createTime = null
  if (formRef.value) formRef.value.resetFields()
}

const onFilterSubmit = async () => {
  loading.value = true
  try {
    const query = {
      key: queryForm.address,
      startDate: queryForm.createTime?.[0]
        ? dayjs(queryForm.createTime[0]).valueOf().toString()
        : undefined,
      endDate: queryForm.createTime?.[1]
        ? dayjs(queryForm.createTime[1]).valueOf().toString()
        : undefined,
    }
    const { data } = await getFootprintListAPI({ query })
    footprintList.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const geoLoading = ref(false)

const getGeocode = async () => {
  if (!form.address) {
    // allow empty to skip if user clears input, or show mild warning if button clicked
    return
  }

  // if already have position and address didn't change enough, maybe skip?
  // but for now let's just fetch

  geoLoading.value = true
  try {
    const { data } = await axios.get('https://restapi.amap.com/v3/geocode/geo', {
      params: {
        address: form.address,
        key: gaodeApKey.value,
      },
    })

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      form.position = data.geocodes[0].location
      ElMessage.success('定位成功')
    } else {
      console.warn('Geocode API Error:', data)
      ElMessage.error(data.info || '定位失败，请检查地址或密钥配置')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('定位服务异常，请检查网络或配置')
  } finally {
    geoLoading.value = false
  }
}

const handleMaterialSelect = (urls: string[]) => {
  form.images = urls.join('\n')
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const sortByDate = (a: Footprint, b: Footprint) => {
  return +a.createTime! - +b.createTime!
}
</script>
