<script setup lang="ts">
import PageTitle from '@/components/PageTitle.vue'
import useConfig from '@/composables/useConfig'
import { Edit } from 'lucide-vue-next'

const {
  activeTab,
  loading,
  initialLoading,
  btnLoading,
  data,
  isModalOpen,
  jsonValue,
  jsonError,
  tabConfig,
  handleEdit,
  handleJsonChange,
  handleFormatJson,
  handleSave,
} = useConfig()

const formatJsonDisplay = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}
</script>

<template>
  <div>
    <PageTitle title="项目配置" />

    <!-- 骨架屏 -->
    <div
      v-if="initialLoading"
      class="mt-2 min-h-[calc(100vh-160px)] p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark"
    >
      <el-skeleton :rows="10" animated />
    </div>

    <div
      v-else
      class="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark mt-2 min-h-[calc(100vh-200px)]"
    >
      <el-tabs v-model="activeTab" class="px-6 py-4">
        <el-tab-pane
          v-for="(config, key) in tabConfig"
          :key="key"
          :label="config.label"
          :name="key"
        >
          <el-table
            :data="data[key]"
            v-loading="loading[key]"
            style="width: 100%"
            :header-cell-style="{ background: '#f8f9fc', color: '#687383' }"
          >
            <el-table-column prop="id" label="ID" width="120" align="center" />
            <el-table-column prop="name" label="名称" width="150" />
            <el-table-column prop="notes" label="备注" width="150" />

            <el-table-column label="配置内容">
              <template #default="scope">
                <span v-if="activeTab === 'page'" class="text-sm text-gray-500"
                  >内容过多，不易展示</span
                >
                <pre
                  v-else
                  class="min-w-[200px] whitespace-pre-wrap break-all bg-gray-50 dark:bg-slate-800 p-2 rounded text-xs overflow-auto max-h-[100px]"
                  >{{ formatJsonDisplay(scope.row.value) }}</pre
                >
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" fixed="right" align="center">
              <template #default="scope">
                <div class="flex justify-center">
                  <el-button link type="primary" :icon="Edit" @click="handleEdit(scope.row)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="isModalOpen"
      :title="tabConfig[activeTab].modalTitle"
      width="800px"
      align-center
      destroy-on-close
    >
      <el-form layout="vertical">
        <el-form-item label="配置内容" required :error="jsonError" class="!mb-4">
          <el-input
            v-model="jsonValue"
            type="textarea"
            rows="15"
            placeholder="请输入 JSON 配置"
            class="font-mono text-sm"
            @input="handleJsonChange"
            :class="{ 'item-error': !!jsonError }"
          />
        </el-form-item>

        <el-button @click="handleFormatJson" class="w-full mb-2"> 格式化 </el-button>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isModalOpen = false">取消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleSave"> 保存配置 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.font-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
:deep(.el-textarea__inner) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
.item-error :deep(.el-textarea__inner) {
  border-color: #f56c6c;
}
</style>
