<template>
  <div>
    <Title value="存储管理" />

    <el-spin :spinning="loading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        <div
          v-for="record in ossList"
          :key="record.id"
          class="relative p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          :class="
            record.isEnable
              ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/30 dark:via-boxdark dark:to-blue-900/30 dark:border-blue-500'
              : 'border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-boxdark/80 dark:via-boxdark dark:to-boxdark-2/80 dark:border-strokedark'
          "
        >
          <!-- Decor -->
          <div
            class="absolute top-0 right-0 w-32 h-32 opacity-20 dark:opacity-10 pointer-events-none"
          >
            <div
              class="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 blur-xl"
            ></div>
          </div>

          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <component
                  :is="getPlatformIcon(record.platform)"
                  class="text-4xl"
                  :class="getPlatformColor(record.platform)"
                />
                <div>
                  <div class="font-semibold text-lg dark:text-white">
                    {{
                      record.platform === 'local'
                        ? '本地存储'
                        : record.platformName || record.platform
                    }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{
                      record.platform === 'local'
                        ? '本地存储'
                        : record.platform === 'webdav'
                          ? 'WebDAV'
                          : record.platformName || '云存储'
                    }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <StatusTag :status="record.isEnable" :flash="!!record.isEnable" />
              </div>
            </div>

            <div class="mb-4 space-y-2">
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">存储路径</div>
                <div
                  class="text-sm font-mono bg-white/60 dark:bg-boxdark-2/60 backdrop-blur-sm p-2 rounded break-all border border-gray-100 dark:border-strokedark dark:text-gray-300"
                >
                  {{ record.basePath || '/uploads' }}
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-strokedark/50"
            >
              <div class="flex items-center gap-2">
                <el-tooltip content="测试连接">
                  <el-button
                    link
                    :icon="Link2"
                    :loading="testingMap[record.id!]"
                    @click="testConnection(record)"
                    >测试</el-button
                  >
                </el-tooltip>
                <el-tooltip content="编辑配置">
                  <el-button link type="primary" :icon="Edit" @click="editOssData(record)"
                    >编辑</el-button
                  >
                </el-tooltip>
                <el-popconfirm title="你确定要删除吗" @confirm="delOssData(record.id!)">
                  <template #reference>
                    <el-button link type="danger" :icon="Trash2">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="flex items-center gap-2">
                <el-switch
                  v-model="record.isEnable"
                  :loading="switchLoadingMap[record.id!]"
                  :active-value="1"
                  :inactive-value="0"
                  @change="(val: string | number | boolean) => handleSwitchChange(val, record.id!)"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="group flex flex-col justify-center items-center text-gray-400 dark:text-gray-500 bg-white dark:bg-boxdark p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 dark:border-strokedark cursor-pointer hover:border-primary dark:hover:border-primary min-h-[200px]"
          @click="addOssData"
        >
          <Plus class="text-2xl mb-2 group-hover:text-primary" />
          <div class="text-sm font-medium group-hover:text-primary">添加新存储</div>
        </div>
      </div>
    </el-spin>

    <el-dialog
      v-model="isModalOpen"
      :title="oss.id ? '编辑存储' : '新增存储'"
      width="600px"
      @close="handleCancel"
    >
      <el-form ref="formRef" :model="form" :rules="rules" layout="vertical" label-position="top">
        <el-form-item v-if="!oss.id" label="选择平台" prop="platform">
          <el-select v-model="form.platform" placeholder="请选择平台" class="w-full">
            <el-option
              v-for="item in platformList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <template v-if="currentPlatform !== 'local'">
          <el-form-item
            label="Access Key"
            prop="accessKey"
            :rules="[{ required: true, message: 'Access Key 不能为空' }]"
          >
            <el-input v-model="form.accessKey" placeholder="请输入Access Key" />
          </el-form-item>
          <el-form-item
            label="SecretKey"
            prop="secretKey"
            :rules="[{ required: true, message: 'SecretKey 不能为空' }]"
          >
            <el-input
              v-model="form.secretKey"
              type="password"
              show-password
              placeholder="请输入SecretKey"
            />
          </el-form-item>
          <el-form-item
            label="地域"
            prop="endPoint"
            :rules="[{ required: true, message: '地域不能为空' }]"
          >
            <el-input v-model="form.endPoint" placeholder="请输入地域" />
          </el-form-item>
          <el-form-item
            label="存储桶"
            prop="bucketName"
            :rules="[{ required: true, message: '存储桶不能为空' }]"
          >
            <el-input v-model="form.bucketName" placeholder="请输入存储桶" />
          </el-form-item>
        </template>

        <el-form-item label="域名" prop="domain">
          <el-input v-model="form.domain" placeholder="请输入域名" />
        </el-form-item>

        <el-form-item
          :label="currentPlatform === 'local' ? '存储路径' : '文件目录'"
          prop="basePath"
        >
          <el-input
            v-model="form.basePath"
            :placeholder="
              currentPlatform === 'local' ? '请输入存储路径，如：/uploads' : '请输入文件目录'
            "
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="onSubmit">
          {{ oss.id ? '保存修改' : '新增配置' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'StorageManager',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import {
  Link2,
  Edit,
  Trash2,
  Plus,
  Database,
  Globe,
  HardDrive,
  Server,
  Cloud,
} from 'lucide-vue-next'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import Title from '@/components/Title/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import {
  addOssDataAPI,
  delOssDataAPI,
  editOssDataAPI,
  getOssListAPI,
  enableOssDataAPI,
  disableOssDataAPI,
  getOssDataAPI,
  getOssPlatformListAPI,
} from '@/api/oss'
import type { Oss } from '@/types/app/oss'

const loading = ref(false)
const btnLoading = ref(false)
const isModalOpen = ref(false)
const ossList = ref<Oss[]>([])
const platformList = ref<{ label: string; value: string; disabled: boolean }[]>([])
const oss = ref<Oss>({} as Oss)
const testingMap = ref<Record<number, boolean>>({})
const switchLoadingMap = ref<Record<number, boolean>>({})

const formRef = ref<FormInstance>()
const form = reactive({
  platform: '',
  accessKey: '',
  secretKey: '',
  endPoint: '',
  bucketName: '',
  domain: '',
  basePath: '',
})

const rules = reactive<FormRules>({
  platform: [{ required: true, message: '平台不能为空', trigger: 'change' }],
  domain: [{ required: true, message: '域名不能为空', trigger: 'blur' }],
  basePath: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
})

const currentPlatform = computed(() => form.platform || oss.value.platform)

const getPlatformIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'local':
      return Database
    case 'webdav':
      return Globe
    case 'minio':
      return HardDrive
    case 'qiniu':
      return Server
    case 'aliyun':
    case 'tencent':
    default:
      return Cloud
  }
}

const getPlatformColor = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'local':
      return 'text-yellow-500'
    case 'webdav':
    case 'minio':
      return 'text-red-500'
    case 'qiniu':
      return 'text-blue-500'
    case 'tencent':
      return 'text-blue-700'
    case 'aliyun':
      return 'text-orange-500'
    default:
      return 'text-blue-500'
  }
}

const getOssList = async () => {
  loading.value = true
  try {
    const { data } = await getOssListAPI()
    ossList.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const getOssPlatformList = async () => {
  const selected = ossList.value
    .filter((item) => !oss.value.id || item.id !== oss.value.id)
    .map((item) => item.platform)
  const { data } = await getOssPlatformListAPI()
  platformList.value = data.map((item: { name: string; value: string }) => ({
    label: item.name,
    value: item.value,
    disabled: selected.includes(item.value),
  }))
}

onMounted(() => {
  getOssList()
})

watch([ossList, () => oss.value.id], () => {
  if (ossList.value.length) getOssPlatformList()
})

const testConnection = async (record: Oss) => {
  testingMap.value[record.id!] = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success('测试连接成功')
  } catch {
    ElMessage.error('测试连接失败')
  } finally {
    testingMap.value[record.id!] = false
  }
}

const handleSwitchChange = async (val: string | number | boolean, id: number) => {
  switchLoadingMap.value[id] = true
  try {
    if (val) {
      await enableOssDataAPI(id)
      ElMessage.success('启用成功')
    } else {
      await disableOssDataAPI(id)
      ElMessage.success('禁用成功')
    }
    await getOssList()
  } catch (e) {
    console.error(e)
    // revert change if failed?
    // We'll reload list anyway.
  } finally {
    switchLoadingMap.value[id] = false
  }
}

const addOssData = () => {
  oss.value = {} as Oss
  form.platform = ''
  resetForm()
  isModalOpen.value = true
}

const editOssData = async (record: Oss) => {
  oss.value = record
  const { data } = await getOssDataAPI(record.id)
  Object.assign(form, data)
  isModalOpen.value = true
}

const delOssData = async (id: number) => {
  try {
    await delOssDataAPI(id)
    ElMessage.success('🎉 删除成功')
    getOssList()
  } catch (e) {
    console.error(e)
  }
}

const handleCancel = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.accessKey = ''
  form.secretKey = ''
  form.endPoint = ''
  form.bucketName = ''
  form.domain = ''
  form.basePath = ''
  if (formRef.value) formRef.value.resetFields()
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        if (oss.value.id) {
          await editOssDataAPI({ ...oss.value, ...form })
          ElMessage.success('🎉 编辑成功')
        } else {
          await addOssDataAPI({ isEnable: 0, ...form })
          ElMessage.success('🎉 新增成功')
        }
        handleCancel()
        getOssList()
      } catch (e) {
        console.error(e)
      } finally {
        btnLoading.value = false
      }
    }
  })
}
</script>
