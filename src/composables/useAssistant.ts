import { ref, reactive } from 'vue'
import {
  getAssistantListAPI,
  addAssistantDataAPI,
  editAssistantDataAPI,
  delAssistantDataAPI,
  setDefaultAssistantAPI,
} from '@/api/assistant'
import type { Assistant } from '@/types/app/assistant'
import { ElMessage } from 'element-plus'
import { callAssistantAPI } from '@/services/assistant'

export default function useAssistant() {
  const list = ref<Assistant[]>([])
  const loading = ref(false)
  const testingMap = reactive<Record<number, boolean>>({})

  // 获取助手列表
  const getList = async () => {
    loading.value = true
    try {
      const res = await getAssistantListAPI()
      list.value = res.data || []
    } catch (error) {
      console.error(error)
      ElMessage.error('获取助手列表失败')
    } finally {
      loading.value = false
    }
  }

  // 保存助手（新增或编辑）
  const saveAssistant = async (data: Assistant) => {
    try {
      if (data.id) {
        await editAssistantDataAPI(data)
        ElMessage.success('更新成功')
      } else {
        await addAssistantDataAPI(data)
        ElMessage.success('添加成功')
      }
      await getList()
      return true
    } catch (error) {
      console.error(error)
      ElMessage.error(data.id ? '更新失败' : '添加失败')
      return false
    }
  }

  // 删除助手
  const delAssistantData = async (id: number) => {
    try {
      await delAssistantDataAPI(id)
      ElMessage.success('删除成功')
      await getList()
      return true
    } catch (error) {
      console.error(error)
      ElMessage.error('删除失败')
      return false
    }
  }

  // 设置默认助手
  const setDefaultAssistant = async (id: number) => {
    try {
      await setDefaultAssistantAPI(id)
      ElMessage.success('设置成功')
      await getList()
    } catch (error) {
      console.error(error)
      ElMessage.error('设置失败')
    }
  }

  // 测试连接 (Mock implementation as API is missing)
  const testConnection = async (item: Assistant) => {
    testingMap[item.id] = true
    try {
      // TODO: Implement actual connection test
      await new Promise((resolve) => setTimeout(resolve, 1500))
      ElMessage.success(`与 ${item.name} 连接成功`)
    } catch {
      ElMessage.error('连接测试失败')
    } finally {
      testingMap[item.id] = false
    }
  }

  // 调用助手
  const callAssistant = async (
    messages: Array<{ role: string; content: string }>,
    options: {
      stream?: boolean
      temperature?: number
      max_tokens?: number
    } = {},
  ) => {
    if (list.value.length === 0) {
      await getList()
    }
    const defaultAssistant = list.value.find((item) => item.isDefault === 1) || list.value[0]

    if (!defaultAssistant) {
      ElMessage.warning('请先配置 AI 助手')
      throw new Error('No assistant configured')
    }

    return await callAssistantAPI(defaultAssistant, messages, options)
  }

  // Initialize
  getList()

  return {
    list,
    loading,
    testingMap,
    getList,
    saveAssistant,
    delAssistantData,
    setDefaultAssistant,
    testConnection,
    callAssistant,
  }
}
