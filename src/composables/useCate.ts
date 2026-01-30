import { ref } from 'vue'
import {
  getCateListAPI,
  addCateDataAPI,
  editCateDataAPI,
  delCateDataAPI,
  getCateDataAPI,
} from '@/api/cate'
import type { Cate } from '@/types/app/cate'
import { ElMessage, ElMessageBox } from 'element-plus'

export default function useCate() {
  const loading = ref(false)
  const initialLoading = ref(true)
  const btnLoading = ref(false)
  const list = ref<Cate[]>([])

  // Modal & Form State
  const isModalOpen = ref(false)
  const isMethod = ref<'create' | 'edit'>('create')
  const isCateShow = ref(false) // Whether to show URL field (nav type)
  const cateForm = ref<Cate>({} as Cate)

  // 获取分类列表
  const getCateList = async () => {
    try {
      if (initialLoading.value) {
        // Keep initialLoading true
      } else {
        loading.value = true
      }

      const res = await getCateListAPI()
      const data = res.data || []

      if (Array.isArray(data)) {
        data.sort((a: Cate, b: Cate) => (a.order || 0) - (b.order || 0))
        list.value = data
      } else {
        list.value = []
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('获取分类列表失败')
    } finally {
      initialLoading.value = false
      loading.value = false
    }
  }

  // 打开新增模态框
  const openAddModal = (parentId: number = 0) => {
    isMethod.value = 'create'
    isModalOpen.value = true
    isCateShow.value = false
    // Reset form
    cateForm.value = {
      level: parentId, // Use 'level' to store parent_id as per React logic `setCate({ ...cate, level: id, type: 'cate' });`
      type: 'cate',
      name: '',
      mark: '',
      icon: '',
      url: '',
      order: 0,
    } as Cate
  }

  // 打开编辑模态框
  const openEditModal = async (id: number) => {
    try {
      loading.value = true // Use loading or a specific editLoading
      isMethod.value = 'edit'
      isModalOpen.value = true

      // Fetch fresh data
      const res = await getCateDataAPI(id)
      const data = res.data

      isCateShow.value = data.type !== 'cate'
      cateForm.value = { ...data }
    } catch (error) {
      console.error(error)
      ElMessage.error('获取分类详情失败')
      isModalOpen.value = false
    } finally {
      loading.value = false
    }
  }

  // 删除分类
  const deleteCate = (id: number) => {
    ElMessageBox.confirm('你确定要删除吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          loading.value = true
          await delCateDataAPI(id)
          ElMessage.success('🎉 删除分类成功')
          await getCateList()
        } catch (error) {
          console.error(error)
          ElMessage.error('删除失败')
        } finally {
          loading.value = false
        }
      })
      .catch(() => {
        // cancel
      })
  }

  // 提交表单
  const submitForm = async () => {
    btnLoading.value = true
    try {
      const values = { ...cateForm.value }
      if (values.type === 'cate') {
        values.url = '/'
      }

      // Ensure numbers are numbers
      values.order = Number(values.order)
      values.level = Number(values.level)

      if (isMethod.value === 'edit') {
        await editCateDataAPI(values)
        ElMessage.success('🎉 修改分类成功')
      } else {
        await addCateDataAPI(values)
        ElMessage.success('🎉 新增分类成功')
      }

      await getCateList()
      isModalOpen.value = false
      cateForm.value = {} as Cate
    } catch (error) {
      console.error(error)
      ElMessage.error(isMethod.value === 'edit' ? '修改失败' : '新增失败')
    } finally {
      btnLoading.value = false
    }
  }

  // Helper for Cascader options
  interface CascaderOption {
    value: number
    label: string
    children?: CascaderOption[]
  }

  const toCascaderOptions = (data: Cate[], isRoot: boolean = true): CascaderOption[] => {
    const options: CascaderOption[] = [
      ...(isRoot ? [{ value: 0, label: '一级分类' }] : []),
      ...data.map((item) => ({
        value: item.id!,
        label: item.name,
        children:
          item.children && item.children.length > 0
            ? toCascaderOptions(item.children, false)
            : undefined,
      })),
    ]
    return options
  }

  // Initialize
  getCateList()

  return {
    loading,
    initialLoading,
    btnLoading,
    list,
    isModalOpen,
    isMethod,
    isCateShow,
    cateForm,

    getCateList,
    openAddModal,
    openEditModal,
    deleteCate,
    submitForm,
    toCascaderOptions,
  }
}
