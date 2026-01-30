import { ref } from 'vue'
import {
  getTagListAPI,
  addTagDataAPI,
  editTagDataAPI,
  delTagDataAPI,
  getTagDataAPI,
} from '@/api/tag'
import type { Tag } from '@/types/app/tag'
import { ElMessage, ElMessageBox } from 'element-plus'

export default function useTag() {
  const loading = ref(false)
  const initialLoading = ref(true)
  const btnLoading = ref(false)
  const editLoading = ref(false)

  const list = ref<Tag[]>([])
  const tagForm = ref<Tag>({
    name: '',
  } as Tag)

  const getTagList = async () => {
    try {
      if (!initialLoading.value) {
        loading.value = true
      }

      const res = await getTagListAPI()
      const data = res.data

      if (Array.isArray(data)) {
        list.value = data
      } else {
        list.value = []
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('获取标签列表失败')
    } finally {
      initialLoading.value = false
      loading.value = false
    }
  }

  const editTagData = async (record: Tag) => {
    try {
      editLoading.value = true
      // Fetch fresh data if needed, or just use record
      const res = await getTagDataAPI(record.id)
      const data = res.data
      tagForm.value = { ...data }
    } catch (error) {
      console.error(error)
      ElMessage.error('获取标签详情失败')
    } finally {
      editLoading.value = false
    }
  }

  const delTagData = (id: number) => {
    ElMessageBox.confirm('你确定要删除吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          loading.value = true
          await delTagDataAPI(id)
          ElMessage.success('🎉 删除标签成功')
          await getTagList()
        } catch (error) {
          console.error(error)
          ElMessage.error('删除失败')
        } finally {
          loading.value = false
        }
      })
      .catch(() => {})
  }

  const submitForm = async () => {
    btnLoading.value = true
    try {
      if (tagForm.value.id) {
        await editTagDataAPI(tagForm.value)
        ElMessage.success('🎉 编辑标签成功')
      } else {
        await addTagDataAPI(tagForm.value)
        ElMessage.success('🎉 新增标签成功')
      }

      await getTagList()
      tagForm.value = { name: '' } as Tag
    } catch (error) {
      console.error(error)
      ElMessage.error(tagForm.value.id ? '编辑失败' : '新增失败')
    } finally {
      btnLoading.value = false
    }
  }

  // Initialize
  getTagList()

  return {
    loading,
    initialLoading,
    btnLoading,
    editLoading,
    list,
    tagForm,

    getTagList,
    editTagData,
    delTagData,
    submitForm,
  }
}
