<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import useTag from '@/composables/useTag'
import { Edit, Trash2 } from 'lucide-vue-next'

const {
  loading,
  initialLoading,
  btnLoading,
  editLoading,
  list,
  tagForm,
  editTagData,
  delTagData,
  submitForm,
} = useTag()

const formRef = ref()

const rules = {
  name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await submitForm()
    }
  })
}
</script>

<template>
  <div>
    <PageTitle title="标签管理" />

    <!-- 骨架屏 -->
    <div v-if="initialLoading" class="flex flex-col md:flex-row gap-4 mt-2 h-[calc(100vh-180px)]">
      <div
        class="w-full md:w-[40%] bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6"
      >
        <el-skeleton :rows="3" animated />
      </div>
      <div
        class="w-full md:w-[60%] bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6"
      >
        <el-skeleton :rows="10" animated />
      </div>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-4 mt-2 min-h-[500px]">
      <!-- 左侧表单 -->
      <div class="w-full md:w-[40%] h-fit">
        <el-card
          shadow="hover"
          class="rounded-sm border-stroke dark:border-strokedark"
          v-loading="editLoading"
        >
          <el-form
            ref="formRef"
            :model="tagForm"
            :rules="rules"
            layout="vertical"
            label-position="top"
            size="large"
          >
            <el-form-item label="标签名称" prop="name">
              <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="w-full" :loading="btnLoading" @click="handleSubmit">
                {{ tagForm.id ? '编辑标签' : '新增标签' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 右侧表格 -->
      <div class="w-full md:w-[60%]">
        <el-card
          shadow="hover"
          class="rounded-sm border-stroke dark:border-strokedark"
          :body-style="{ padding: '0' }"
        >
          <el-table
            :data="list"
            v-loading="loading"
            style="width: 100%"
            :header-cell-style="{ background: '#f8f9fc', color: '#687383' }"
          >
            <el-table-column prop="id" label="ID" width="100" align="center" />
            <el-table-column prop="name" label="标签名称" min-width="150" align="center" />
            <el-table-column prop="count" label="文章数量" width="120" align="center" />
            <el-table-column label="操作" width="150" align="center">
              <template #default="scope">
                <div class="flex items-center justify-center gap-2">
                  <el-button link type="primary" :icon="Edit" @click="editTagData(scope.row)" />
                  <el-button link type="danger" :icon="Trash2" @click="delTagData(scope.row.id)" />
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- Pagination could be added here if API supports it, currently using full list -->
          <div class="flex justify-center p-4">
            <el-pagination
              layout="prev, pager, next"
              :total="list.length"
              :page-size="8"
              v-if="list.length > 8"
            />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
