<script setup lang="ts">
import { ref, computed } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import useCate from '@/composables/useCate'
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-vue-next'

const {
  loading,
  initialLoading,
  btnLoading,
  list,
  isModalOpen,
  isMethod,
  isCateShow,
  cateForm,
  openAddModal,
  openEditModal,
  deleteCate,
  submitForm,
  toCascaderOptions,
} = useCate()

// 级联选择器数据 - 转换为 TreeSelect 需要的格式
const cascaderOptions = computed(() => toCascaderOptions(list.value))

// 表单校验规则
const rules = {
  name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  mark: [{ required: true, message: '分类标识不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '请选择分类级别', trigger: 'change' }],
}

const formRef = ref()

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await submitForm()
    }
  })
}

const handleTypeChange = (val: string | number | boolean) => {
  isCateShow.value = val === 'nav'
}
</script>

<template>
  <div>
    <PageTitle title="分类管理">
      <el-button type="primary" size="large" @click="openAddModal(0)"> 新增分类 </el-button>
    </PageTitle>

    <!-- 骨架屏 -->
    <div
      v-if="initialLoading"
      class="mt-2 min-h-[calc(100vh-160px)] p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark"
    >
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 主要内容 -->
    <div
      v-else
      class="mt-2 min-h-[calc(100vh-160px)] bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark"
    >
      <div class="p-6">
        <el-tree
          :data="list"
          node-key="id"
          default-expand-all
          :props="{ children: 'children', label: 'name' }"
          v-loading="loading && !initialLoading"
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <div class="flex justify-between items-center w-full pr-4 group py-2">
              <span class="text-base flex items-center gap-2">
                <span v-if="data.icon" class="text-gray-500">{{ data.icon }}</span>
                <span class="font-medium">{{ node.label }}</span>
                <el-tag
                  size="small"
                  type="info"
                  class="ml-2 bg-gray-100 text-gray-500 border-gray-200"
                  >{{ data.mark }}</el-tag
                >
              </span>

              <el-dropdown trigger="click">
                <el-button
                  link
                  size="small"
                  class="flex items-center gap-1 text-gray-500 hover:text-primary"
                >
                  操作 <ChevronDown class="w-4 h-4" />
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :icon="Plus" @click="openAddModal(data.id)"
                      >新增</el-dropdown-item
                    >
                    <el-dropdown-item :icon="Edit" @click="openEditModal(data.id)"
                      >编辑</el-dropdown-item
                    >
                    <el-dropdown-item
                      :icon="Trash2"
                      class="text-danger"
                      @click="deleteCate(data.id)"
                      >删除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      v-model="isModalOpen"
      :title="isMethod === 'edit' ? '编辑分类' : '新增分类'"
      width="500px"
      align-center
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="cateForm"
        :rules="rules"
        layout="vertical"
        label-position="top"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="cateForm.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="标识" prop="mark">
          <el-input v-model="cateForm.mark" placeholder="请输入分类标识" />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="cateForm.icon" placeholder="请输入分类图标" />
        </el-form-item>

        <el-form-item v-if="isCateShow" label="链接" prop="url">
          <el-input v-model="cateForm.url" placeholder="请输入分类链接" />
        </el-form-item>

        <el-form-item label="顺序" prop="order">
          <el-input
            v-model="cateForm.order"
            type="number"
            placeholder="请输入分类顺序（值越小越靠前）"
          />
        </el-form-item>

        <el-form-item label="级别" prop="level">
          <el-tree-select
            v-model="cateForm.level"
            :data="cascaderOptions"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择分类级别"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="模式" prop="type">
          <el-radio-group v-model="cateForm.type" @change="handleTypeChange">
            <el-radio value="cate">分类</el-radio>
            <el-radio value="nav">导航</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isModalOpen = false">取消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleSubmit">
            {{ isMethod === 'edit' ? '编辑分类' : '新增分类' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.text-danger {
  color: #f56c6c;
}
:deep(.el-tree-node__content) {
  height: 48px;
  border-bottom: 1px solid #f0f0f0;
}
:deep(.el-tree-node__content:hover) {
  background-color: #fafafa;
}
</style>
