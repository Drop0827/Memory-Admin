import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { testAssistantConnection, callAssistantAPI } from '@/services/assistant'
import type { Assistant } from '@/types/app/assistant'
import {
  delAssistantDataAPI,
  getAssistantListAPI,
  addAssistantDataAPI,
  editAssistantDataAPI,
  setDefaultAssistantAPI,
} from '@/api/assistant'

export default function useAssistant() {
  const loading = ref(false)
  const testingMap = ref<Record<string, boolean>>({})

  const list = ref<Assistant[]>([])
  const assistant = ref<string | null>(null)

  // 获取助手列表
  const getAssistantList = async () => {
    const { data } = await getAssistantListAPI()
    list.value = data

    // 设置默认助手
    const defaultAssistant = data.find((a) => a.isDefault)
    if (defaultAssistant) assistant.value = String(defaultAssistant.id)
  }

  // 初始化加载助手列表
  onMounted(() => {
    getAssistantList()
  })

  // 添加或更新助手
  const saveAssistant = async (assistantData: Assistant) => {
    loading.value = true

    try {
      if (assistantData.id) {
        // 更新现有助手
        await editAssistantDataAPI(assistantData)
      } else {
        // 添加新助手
        await addAssistantDataAPI(assistantData)
      }

      // 更新成功后重新获取列表
      await getAssistantList()
      ElMessage.success(assistantData.id ? '助手已更新' : '助手已添加')
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 删除助手
  const delAssistantData = async (id: number) => {
    await delAssistantDataAPI(id)
    getAssistantList()
    ElMessage.success('助手已删除')
  }

  // 设置默认助手
  const setDefaultAssistant = async (id: number) => {
    await setDefaultAssistantAPI(id)
    getAssistantList()
    ElMessage.success('默认助手已更新')
  }

  // 测试助手连接
  const testConnection = async (assistantData: Assistant) => {
    if (assistantData.id) {
      testingMap.value[assistantData.id] = true
    }

    try {
      const result = await testAssistantConnection(assistantData)
      return result
    } finally {
      if (assistantData.id) {
        testingMap.value[assistantData.id] = false
      }
    }
  }

  // 调用助手API
  const callAssistant = async (
    messages: Array<{ role: string; content: string }>,
    options?: {
      stream?: boolean
      temperature?: number
      max_tokens?: number
    },
  ) => {
    if (!assistant.value) {
      ElMessage.error('请先选择助手')
      return null
    }

    const data = list.value.find((a) => a.id === Number(assistant.value))
    if (!data) {
      ElMessage.error('助手不存在')
      return null
    }

    return callAssistantAPI(data, messages, options)
  }

  return {
    list,
    assistant,
    loading,
    testingMap,
    saveAssistant,
    delAssistantData,
    setDefaultAssistant,
    testConnection,
    callAssistant,
  }
}
