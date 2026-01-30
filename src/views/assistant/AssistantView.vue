<script setup lang="ts">
import { ref, computed } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import useAssistant from '@/composables/useAssistant'
import type { Assistant } from '@/types/app/assistant'
import { Plus, Trash2, Edit, MoreHorizontal, Info, Power, Zap, Webhook } from 'lucide-vue-next'
import { ElMessageBox } from 'element-plus'

// 使用 Composable
const {
  list,
  loading,
  testingMap,
  saveAssistant,
  delAssistantData,
  setDefaultAssistant,
  testConnection,
} = useAssistant()

// 模态框控制
const isModalOpen = ref(false)
const formRef = ref()
const formData = ref<Assistant>({
  name: '',
  url: '',
  key: '',
  model: '',
} as Assistant)

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入助手名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入 API 地址', trigger: 'blur' },
    { pattern: /^https?:\/\//, message: '请输入正确的 API 地址', trigger: 'blur' },
  ],
  key: [{ required: true, message: '请输入 API 密钥', trigger: 'blur' }],
  model: [{ required: true, message: '请选择或输入模型', trigger: 'change' }],
}

// 模型信息映射
const modelInfoMap: Record<string, { desc: string; label: string }> = {
  'deepseek-chat': { desc: '通用聊天模型', label: 'DeepSeek Chat' },
  'deepseek-reasoner': { desc: '多步推理优化模型', label: 'DeepSeek Reasoner' },
  'moonshot-v1-128k': { desc: '长上下文模型，支持128k上下文', label: 'Moonshot v1 128k' },
  'gpt-4o': { desc: '多模态大模型', label: 'OpenAI GPT-4o' },
  'gpt-3.5-turbo': { desc: '轻量快速模型', label: 'OpenAI GPT-3.5 Turbo' },
  'glm-4': { desc: '中文大模型', label: '智谱 GLM-4' },
  'qwen-turbo': { desc: '快速对话模型', label: '通义千问 Turbo' },
  'ernie-bot': { desc: '文心一言大模型', label: '百度文心一言大模型' },
  'doubao-chat': { desc: '字节跳动豆包模型', label: '豆包 Chat' },
}

// 获取模型主题
const getModelTheme = (model: string): { color: string; icon: string } => {
  const themeMap: Record<string, { color: string; icon: string }> = {
    'deepseek-chat': { color: '#1890ff', icon: 'DS' },
    'deepseek-reasoner': { color: '#722ed1', icon: 'DR' },
    'moonshot-v1-128k': { color: '#13c2c2', icon: 'M' },
    'gpt-4o': { color: '#52c41a', icon: 'GPT4' },
    'gpt-3.5-turbo': { color: '#faad14', icon: 'GPT3' },
    'glm-4': { color: '#eb2f96', icon: 'GLM' },
    'qwen-turbo': { color: '#f5222d', icon: 'QW' },
    'ernie-bot': { color: '#fa8c16', icon: 'EB' },
    'doubao-chat': { color: '#2f54eb', icon: 'DB' },
  }
  return themeMap[model] || { color: '#8c8c8c', icon: 'AI' }
}

// 生成下拉选项
const modelOptions = computed(() => {
  const options = Object.entries(modelInfoMap).map(([value, info]) => ({
    label: info.label,
    value,
    desc: info.desc,
  }))

  // 如果当前输入的不在列表中，添加进去（支持自定义模型）
  if (formData.value.model && !options.find((opt) => opt.value === formData.value.model)) {
    options.push({
      label: formData.value.model,
      value: formData.value.model,
      desc: '自定义模型',
    })
  }

  return options
})

// 打开编辑
const handleEdit = (item: Assistant) => {
  formData.value = { ...item }
  isModalOpen.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      console.log('Valid', formData.value)
      const success = await saveAssistant(formData.value)
      if (success) {
        isModalOpen.value = false
        formRef.value.resetFields()
        formData.value = { name: '', url: '', key: '', model: '' } as Assistant
      }
    }
  })
}

// 删除确认
const handleDelete = (item: Assistant) => {
  ElMessageBox.confirm(`您确定要删除助手 "${item.name}" 吗？此操作无法撤销。`, '确认删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  }).then(() => {
    delAssistantData(item.id)
  })
}

const handleOpenModal = () => {
  formData.value = { name: '', url: '', key: '', model: '' } as Assistant
  isModalOpen.value = true
}
</script>

<template>
  <div>
    <PageTitle title="助手管理">
      <el-button type="primary" size="large" @click="handleOpenModal"> 添加助手 </el-button>
    </PageTitle>

    <!-- 骨架屏 Loading -->
    <div
      v-if="loading && list.length === 0"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3"
    >
      <el-card v-for="i in 3" :key="i" shadow="hover" class="rounded-xl">
        <el-skeleton :rows="3" animated />
      </el-card>
    </div>

    <!-- 列表区域 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
      <el-card
        v-for="item in list"
        :key="item.id"
        :class="[
          'relative rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden',
          item.isDefault
            ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/30 dark:via-boxdark dark:to-blue-900/30'
            : 'border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-boxdark/80 dark:via-boxdark dark:to-boxdark-2/80 dark:border-strokedark',
        ]"
        :body-style="{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        }"
      >
        <!-- 头部 -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <el-avatar
              shape="square"
              :size="48"
              :style="{ backgroundColor: getModelTheme(item.model).color }"
              class="shadow-md text-lg font-bold text-white"
            >
              {{ getModelTheme(item.model).icon }}
            </el-avatar>

            <div>
              <div
                class="font-bold text-lg text-gray-800 dark:text-white leading-tight mb-1 truncate max-w-[160px] ml-1"
              >
                {{ item.name }}
              </div>

              <div class="flex items-center gap-1 ml-1">
                <el-tag
                  type="info"
                  size="small"
                  effect="plain"
                  class="bg-gray-100 dark:bg-boxdark-2 border-none"
                >
                  {{ modelInfoMap[item.model]?.label || item.model }}
                </el-tag>
                <el-tooltip
                  v-if="modelInfoMap[item.model]"
                  :content="modelInfoMap[item.model].desc"
                  placement="top"
                >
                  <Info
                    class="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-primary"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>

          <!-- 下拉菜单 -->
          <el-dropdown trigger="click">
            <el-button link class="!p-1">
              <MoreHorizontal class="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Edit" @click="handleEdit(item)">编辑配置</el-dropdown-item>
                <el-dropdown-item
                  :icon="Power"
                  :disabled="!!item.isDefault"
                  @click="setDefaultAssistant(item.id)"
                >
                  {{ item.isDefault ? '已开启' : '开启助手' }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  :icon="Trash2"
                  class="text-danger"
                  @click="handleDelete(item)"
                >
                  删除助手
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- API Endpoint Display -->
        <div
          class="bg-gray-50 dark:bg-boxdark-2 rounded-md px-3 py-2 mb-2 flex-1 border border-gray-100 dark:border-strokedark"
        >
          <div
            class="flex items-center text-gray-400 dark:text-gray-500 text-xs uppercase font-bold mb-1"
          >
            <Webhook class="w-3 h-3 mr-1" /> API Endpoint
          </div>
          <div class="text-gray-600 dark:text-gray-300 font-mono text-sm break-all">
            {{ item.url }}
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="mt-auto pt-2 border-t border-gray-100 dark:border-strokedark flex justify-end">
          <el-button
            :type="testingMap[item.id] ? 'default' : 'primary'"
            :loading="testingMap[item.id]"
            :plain="!testingMap[item.id]"
            class="w-full !justify-center"
            @click="testConnection(item)"
          >
            <template #icon>
              <Zap :class="{ 'animate-spin': testingMap[item.id] }" />
            </template>
            {{ testingMap[item.id] ? '连接测试中...' : '测试连接' }}
          </el-button>
        </div>
      </el-card>

      <!-- 添加按钮 Card -->
      <button
        class="h-auto min-h-[200px] border-2 border-dashed border-gray-300 dark:border-strokedark flex flex-col items-center justify-center gap-2 bg-transparent hover:border-primary dark:hover:border-primary text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary rounded-xl transition-colors duration-300"
        @click="handleOpenModal"
      >
        <Plus class="w-8 h-8" />
        <span class="font-medium text-lg">添加新助手</span>
      </button>
    </div>

    <!-- 编辑/添加 弹窗 -->
    <el-dialog
      v-model="isModalOpen"
      :title="formData.id ? '编辑助手' : '添加助手'"
      width="500px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        label-position="top"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="例如：DeepSeek、OpenAI 等" />
        </el-form-item>

        <el-form-item label="API 地址" prop="url">
          <template #label>
            <div class="flex items-center gap-1">
              API 地址
              <el-tooltip
                content="填写完整的 API 接口地址，如 https://api.deepseek.com/v1"
                placement="top"
              >
                <Info class="w-4 h-4 text-gray-400" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="formData.url" placeholder="https://api.deepseek.com/v1" />
        </el-form-item>

        <el-form-item label="API 密钥" prop="key">
          <el-input
            v-model="formData.key"
            type="password"
            show-password
            placeholder="请输入 API 密钥"
          />
        </el-form-item>

        <el-form-item label="模型" prop="model">
          <el-select
            v-model="formData.model"
            filterable
            allow-create
            default-first-option
            placeholder="选择或输入模型"
            class="w-full"
          >
            <el-option
              v-for="item in modelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div class="flex justify-between items-center">
                <span>{{ item.label }}</span>
                <span v-if="item.desc" class="text-gray-400 text-xs ml-2">{{ item.desc }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isModalOpen = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ formData.id ? '保存' : '添加' }}
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
</style>
