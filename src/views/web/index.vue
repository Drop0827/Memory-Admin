<template>
  <div>
    <Title value="网站管理">
      <el-button type="primary" size="large" @click="openAddModal">新增网站</el-button>
    </Title>

    <el-card class="min-h-[calc(100vh-160px)]" :class="titleSty">
      <div class="flex justify-center w-full mt-1 mb-2">
        <el-input v-model="search" placeholder="请输入网站名称或描述信息进行查询" class="w-[300px]">
          <template #prefix>
            <Search class="w-4 h-4" />
          </template>
        </el-input>
      </div>

      <el-spin :spinning="loading">
        <div class="space-y-10">
          <template v-for="(group, key) in list" :key="key">
            <div v-if="group.length" class="space-y-6">
              <!-- Group Header -->
              <div
                class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 dark:bg-boxdark/60 backdrop-blur-md border border-white/20 dark:border-strokedark/30 shadow-sm shadow-primary/5"
              >
                <img :src="GroupSvg" alt="分组图标" class="w-5 h-5 opacity-80" />
                <span class="text-base font-semibold text-gray-800 dark:text-gray-200">{{
                  key
                }}</span>
              </div>

              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
              >
                <div
                  v-for="item in group"
                  :key="item.id"
                  class="group relative flex flex-col items-center p-6 pb-0 rounded-3xl bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-boxdark/80 dark:via-boxdark/70 dark:to-boxdark/60 backdrop-blur-xl border border-white/40 dark:border-strokedark/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  <!-- Decor -->
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <div
                    class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent dark:from-primary/40 dark:via-primary/20 rounded-t-3xl"
                  ></div>
                  <div
                    class="absolute top-4 right-4 w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                  <div
                    class="absolute bottom-4 left-4 w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  ></div>

                  <!-- Content -->
                  <div
                    class="relative z-10 flex items-center justify-center w-24 h-24 mt-3 mb-5 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-boxdark-2 dark:to-boxdark shadow-2xl ring-4 ring-white/60 dark:ring-strokedark/40 ring-offset-2 ring-offset-white/50 dark:ring-offset-boxdark/50 transition-transform duration-300 group-hover:scale-110 group-hover:ring-primary/30 group-hover:shadow-primary/30"
                  >
                    <div
                      class="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <img
                      :src="item.image"
                      :alt="item.title"
                      class="relative z-10 w-[88%] h-[88%] rounded-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
                    />
                    <div
                      class="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/30 transition-all duration-300"
                    ></div>
                  </div>

                  <h3
                    class="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white text-center transition-all duration-300 group-hover:text-primary group-hover:scale-105 line-clamp-1"
                  >
                    {{ item.title }}
                  </h3>
                  <p
                    class="relative z-10 mb-4 text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-2 leading-relaxed min-h-[2.5rem] px-2 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                  >
                    {{ item.description }}
                  </p>

                  <div
                    class="relative z-10 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 dark:from-primary/25 dark:via-primary/20 dark:to-primary/15 text-primary dark:text-primary/90 text-xs font-semibold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary/25 group-hover:via-primary/20 group-hover:to-primary/15 dark:group-hover:from-primary/35 dark:group-hover:via-primary/30 dark:group-hover:to-primary/25 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/20 border border-primary/20 dark:border-primary/30"
                  >
                    <span class="flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      {{ item.type.name }}
                    </span>
                  </div>

                  <!-- Action Buttons -->
                  <div
                    class="absolute z-50 inset-x-0 bottom-0 flex flex-col gap-3 py-5 px-3 bg-gradient-to-t from-white/98 via-white/95 to-white/90 dark:from-boxdark/98 dark:via-boxdark/95 dark:to-boxdark/90 backdrop-blur-xl border-t border-gray-200/60 dark:border-strokedark/60 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.3)] transform translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out"
                  >
                    <div
                      class="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent dark:via-primary/50"
                    ></div>

                    <div class="flex gap-3">
                      <button
                        @click.stop="editLinkData(item)"
                        class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-600 hover:via-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95 transform flex items-center justify-center gap-1.5"
                      >
                        <Edit class="w-4 h-4" />
                        修改
                      </button>
                      <el-popconfirm
                        title="确定要删除这个网站吗？"
                        @confirm.stop="deleteLinkData(item.id!)"
                      >
                        <template #reference>
                          <button
                            @click.stop
                            class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 via-red-500 to-red-600 hover:from-red-600 hover:via-red-600 hover:to-red-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/40 active:scale-95 transform flex items-center justify-center gap-1.5"
                          >
                            <Trash2 class="w-4 h-4" />
                            删除
                          </button>
                        </template>
                      </el-popconfirm>
                    </div>

                    <button
                      @click.stop="toHref(item.url)"
                      class="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/50 active:scale-95 transform flex items-center justify-center gap-2 group/btn"
                    >
                      <ExternalLink
                        class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                      <span>前往该网站</span>
                      <ChevronRight
                        class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </button>
                  </div>
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></div>
                </div>
              </div>
            </div>
          </template>
          <el-empty v-if="!Object.keys(list).length" description="暂无数据" />
        </div>
      </el-spin>
    </el-card>

    <el-dialog
      v-model="modalVisible"
      :title="isMethod === 'edit' ? '编辑网站' : '新增网站'"
      width="600px"
      @close="reset"
    >
      <el-form ref="formRef" :model="form" :rules="rules" layout="vertical" size="large">
        <el-form-item label="网站标题" prop="title">
          <el-input v-model="form.title" placeholder="Memory" />
        </el-form-item>
        <el-form-item label="网站描述" prop="description">
          <el-input v-model="form.description" placeholder="记录前端、Python、Java点点滴滴" />
        </el-form-item>
        <el-form-item label="站长邮箱" prop="email">
          <el-input v-model="form.email" placeholder="2720751424@qq.com" />
        </el-form-item>
        <el-form-item label="网站图标" prop="image">
          <el-input v-model="form.image" placeholder="https://liuyuyang.net/logo.png" />
        </el-form-item>
        <el-form-item label="网站链接" prop="url">
          <el-input v-model="form.url" placeholder="https://liuyuyang.net/" />
        </el-form-item>
        <el-form-item label="订阅地址" prop="rss">
          <el-input v-model="form.rss" placeholder="https://liuyuyang.net/api/rss" />
        </el-form-item>
        <el-form-item label="网站类型" prop="typeId">
          <el-select v-model="form.typeId" placeholder="请选择网站类型" class="w-full">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="顺序" prop="order">
          <el-input v-model="form.order" placeholder="请输入网站顺序（值越小越靠前）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reset">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebList',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { Search, Edit, Trash2, ExternalLink, ChevronRight } from 'lucide-vue-next'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Title from '@/components/Title/index.vue'
import {
  getLinkListAPI,
  addLinkDataAPI,
  editLinkDataAPI,
  delLinkDataAPI,
  getWebTypeListAPI,
} from '@/api/web'
import type { WebType, Web } from '@/types/app/web'
import GroupSvg from './assets/svg/group.svg'
import { titleSty } from '@/styles/sty'

const loading = ref(false)
const btnLoading = ref(false)
const search = ref('')
const list = ref<{ [key: string]: Web[] }>({})
const listTemp = ref<Web[]>([])
const typeList = ref<WebType[]>([])
const modalVisible = ref(false)
const isMethod = ref<'create' | 'edit'>('create')

const formRef = ref<FormInstance>()
const form = reactive({
  id: undefined as number | undefined,
  title: '',
  description: '',
  email: '',
  image: '',
  url: '',
  rss: '',
  typeId: undefined as number | undefined,
  order: '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateURL = (rule: any, value: string, callback: any) => {
  if (!value || /^(https?:\/\/)/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的链接'))
  }
}

const rules = reactive<FormRules>({
  title: [{ required: true, message: '网站标题不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '网站描述不能为空', trigger: 'blur' }],
  image: [{ required: true, message: '网站图标不能为空', trigger: 'blur' }],
  url: [
    { required: true, message: '网站链接不能为空', trigger: 'blur' },
    { validator: validateURL, trigger: 'blur' },
  ],
  rss: [{ validator: validateURL, trigger: 'blur' }],
  typeId: [{ required: true, message: '网站类型不能为空', trigger: 'change' }],
})

const getLinkList = async () => {
  loading.value = true
  try {
    const { data } = await getLinkListAPI()
    // sort
    data.sort((a: Web, b: Web) => a.order - b.order)
    data.sort((a: Web, b: Web) => a.type.order - b.type.order)
    listTemp.value = data
    groupData(data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const getWebTypeList = async () => {
  const { data } = await getWebTypeListAPI()
  typeList.value = data
}

const groupData = (data: Web[]) => {
  const grouped = data.reduce(
    (acc, item) => {
      const groupName = item.type.name
      if (!acc[groupName]) acc[groupName] = []
      acc[groupName].push(item)
      return acc
    },
    {} as { [key: string]: Web[] },
  )
  list.value = grouped
}

watch(search, (val) => {
  const filtered = listTemp.value.filter(
    (item) => item.title.includes(val) || item.description.includes(val),
  )
  groupData(filtered)
})

onMounted(() => {
  getLinkList()
  getWebTypeList()
})

const openAddModal = () => {
  reset()
  isMethod.value = 'create'
  modalVisible.value = true
}

const editLinkData = (record: Web) => {
  isMethod.value = 'edit'
  // form mappings
  form.id = record.id
  form.title = record.title
  form.description = record.description
  form.email = record.email
  form.image = record.image
  form.url = record.url
  form.rss = record.rss
  form.typeId = record.typeId
  form.order = record.order + ''
  modalVisible.value = true
}

const deleteLinkData = async (id: number) => {
  loading.value = true
  try {
    await delLinkDataAPI(id)
    ElMessage.success('🎉 删除网站成功')
    getLinkList()
  } catch (e) {
    console.error(e)
    loading.value = false
  }
}

const reset = () => {
  form.id = undefined
  form.title = ''
  form.description = ''
  form.email = ''
  form.image = ''
  form.url = ''
  form.rss = ''
  form.typeId = undefined
  form.order = ''
  if (formRef.value) formRef.value.resetFields()
  modalVisible.value = false
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        const values = { ...form, order: Number(form.order) }
        if (isMethod.value === 'edit') {
          await editLinkDataAPI(values as unknown as Web)
          ElMessage.success('🎉 编辑网站成功')
        } else {
          await addLinkDataAPI({
            ...values,
            createTime: new Date().getTime().toString(),
          } as unknown as Web)
          ElMessage.success('🎉 新增网站成功')
        }
        getLinkList()
        reset()
      } catch (e) {
        console.error(e)
      } finally {
        btnLoading.value = false
      }
    }
  })
}

const toHref = (url: string) => {
  window.open(url, '_blank')
}
</script>
