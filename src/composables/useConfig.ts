import { ref, reactive } from 'vue'
import {
  getEnvConfigListAPI,
  getPageConfigListAPI,
  updateEnvConfigDataAPI,
  updatePageConfigDataAPI,
} from '@/api/config'
import type { Config } from '@/types/app/config'
import { ElMessage } from 'element-plus'

type ConfigTab = 'env' | 'page'

export default function useConfig() {
  const activeTab = ref<ConfigTab>('env')
  const loading = reactive({
    env: false,
    page: false,
  })
  const initialLoading = ref(true)
  const btnLoading = ref(false)

  const data = reactive<{ env: Config[]; page: Config[] }>({
    env: [],
    page: [],
  })

  const isModalOpen = ref(false)
  const editItem = ref<Config | null>(null)
  const jsonValue = ref('')
  const jsonError = ref<string | null>(null)

  const tabConfig = {
    env: {
      label: '环境配置',
      getList: getEnvConfigListAPI,
      update: async (item: Config, value: object) => updateEnvConfigDataAPI({ ...item, value }),
      modalTitle: '编辑配置',
    },
    page: {
      label: '页面配置',
      getList: getPageConfigListAPI,
      update: async (item: Config, value: object) =>
        updatePageConfigDataAPI(Number(item.id), value),
      modalTitle: '编辑页面配置',
    },
  }

  const fetchList = async (type: ConfigTab) => {
    try {
      if (initialLoading.value) {
        // keep initial loading
      } else {
        loading[type] = true
      }

      const res = await tabConfig[type].getList()
      const result = res.data

      if (Array.isArray(result)) {
        data[type] = result
      } else {
        data[type] = []
      }
    } catch (error) {
      console.error(error)
      ElMessage.error(`获取${tabConfig[type].label}失败`)
    } finally {
      initialLoading.value = false
      loading[type] = false
    }
  }

  const handleEdit = (item: Config) => {
    editItem.value = item
    jsonValue.value = JSON.stringify(item.value, null, 2)
    jsonError.value = null
    isModalOpen.value = true
  }

  const handleJsonChange = (val: string) => {
    jsonValue.value = val
    try {
      JSON.parse(val)
      jsonError.value = null
    } catch (e) {
      jsonError.value = (e as Error).message
    }
  }

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonValue.value)
      jsonValue.value = JSON.stringify(parsed, null, 2)
      jsonError.value = null
    } catch {
      ElMessage.error('JSON 格式错误，无法格式化')
    }
  }

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonValue.value)
      btnLoading.value = true

      await tabConfig[activeTab.value].update(editItem.value!, parsed)
      ElMessage.success('保存成功')

      await fetchList(activeTab.value)
      isModalOpen.value = false
      editItem.value = null
    } catch {
      ElMessage.error('保存失败，请检查 JSON 格式')
    } finally {
      btnLoading.value = false
    }
  }

  // Initialize
  fetchList('env')
  fetchList('page')

  return {
    activeTab,
    loading,
    initialLoading,
    btnLoading,
    data,
    isModalOpen,
    editItem,
    jsonValue,
    jsonError,
    tabConfig,

    fetchList,
    handleEdit,
    handleJsonChange,
    handleFormatJson,
    handleSave,
  }
}
