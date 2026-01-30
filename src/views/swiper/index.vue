<template>
  <div>
    <Title value="轮播图管理" />

    <el-card class="mt-2 min-h-[calc(100vh-160px)]" :class="titleSty">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="轮播图列表" name="list">
          <el-table :data="list" v-loading="loading">
            <el-table-column prop="id" label="ID" width="120" align="center" />
            <el-table-column label="图片" width="200" align="center">
              <template #default="{ row }">
                <el-image
                  :src="row.image"
                  class="w-full rounded cursor-pointer"
                  :preview-src-list="[row.image]"
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="130" align="center">
              <template #default="{ row }">
                <div class="flex space-x-2 justify-center">
                  <el-button link @click="editSwiperData(row)">
                    <template #icon>
                      <FileEdit class="text-primary w-4 h-4" />
                    </template>
                  </el-button>
                  <el-popconfirm title="你确定要删除吗" @confirm="delSwiperData(row.id)">
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
        </el-tab-pane>
        <el-tab-pane :label="swiper.id ? '编辑轮播图' : '新增轮播图'" name="operate">
          <el-spin :spinning="editLoading">
            <h2 class="text-xl pb-4 text-center">{{ swiper.id ? '编辑轮播图' : '新增轮播图' }}</h2>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              layout="vertical"
              size="large"
              class="max-w-md mx-auto"
            >
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="要么沉沦 要么巅峰!" />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="form.description" placeholder="Either sink or peak!" />
              </el-form-item>
              <el-form-item label="链接" prop="url">
                <el-input v-model="form.url" placeholder="https://liuyuyang.net/" />
              </el-form-item>
              <el-form-item label="图片" prop="image">
                <el-input v-model="form.image" placeholder="https://liuyuyang.net/swiper.jpg">
                  <template #prefix>
                    <Image class="w-4 h-4" />
                  </template>
                  <template #append>
                    <UploadCloud
                      class="text-xl cursor-pointer"
                      @click="isMaterialModalOpen = true"
                    />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="w-full" :loading="btnLoading" @click="onSubmit">
                  {{ swiper.id ? '编辑轮播图' : '新增轮播图' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-spin>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <Material
      :open="isMaterialModalOpen"
      @close="isMaterialModalOpen = false"
      @select="handleMaterialSelect"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SwiperList',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { FileEdit, Trash2, Image, UploadCloud } from 'lucide-vue-next'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Title from '@/components/Title/index.vue'
import Material from '@/components/Material/index.vue'
import {
  getSwiperListAPI,
  addSwiperDataAPI,
  editSwiperDataAPI,
  delSwiperDataAPI,
  getSwiperDataAPI,
} from '@/api/swiper'
import type { Swiper } from '@/types/app/swiper'
import { titleSty } from '@/styles/sty'

const loading = ref(false)
const btnLoading = ref(false)
const editLoading = ref(false)
const list = ref<Swiper[]>([])
const swiper = ref<Swiper>({} as Swiper)
const activeTab = ref('list')
const isMaterialModalOpen = ref(false)

const formRef = ref<FormInstance>()
const form = reactive({
  title: '',
  description: '',
  url: '',
  image: '',
})

const rules = reactive<FormRules>({
  title: [{ required: true, message: '轮播图标题不能为空', trigger: 'blur' }],
  image: [{ required: true, message: '轮播图地址不能为空', trigger: 'blur' }],
})

const getSwiperList = async () => {
  loading.value = true
  try {
    const { data } = await getSwiperListAPI()
    list.value = data as Swiper[]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getSwiperList()
})

const handleTabChange = (name: string | number) => {
  if (name === 'list') {
    swiper.value = {} as Swiper
    resetForm()
  }
}

const editSwiperData = async (record: Swiper) => {
  editLoading.value = true
  activeTab.value = 'operate'
  try {
    const { data } = await getSwiperDataAPI(record.id!)
    swiper.value = data
    Object.assign(form, data)
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
  }
}

const delSwiperData = async (id: number) => {
  try {
    await delSwiperDataAPI(id)
    ElMessage.success('🎉 删除轮播图成功')
    getSwiperList()
  } catch (e) {
    console.error(e)
  }
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        if (swiper.value.id) {
          await editSwiperDataAPI({ ...swiper.value, ...form })
          ElMessage.success('🎉 编辑轮播图成功')
        } else {
          await addSwiperDataAPI(form)
          ElMessage.success('🎉 新增轮播图成功')
        }
        getSwiperList()
        activeTab.value = 'list'
        resetForm()
        swiper.value = {} as Swiper
      } catch (e) {
        console.error(e)
      } finally {
        btnLoading.value = false
      }
    }
  })
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.url = ''
  form.image = ''
  if (formRef.value) formRef.value.resetFields()
}

const handleMaterialSelect = (urls: string[]) => {
  form.image = urls.join('\n')
}
</script>
