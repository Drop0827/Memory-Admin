<template>
  <div>
    <h2 class="text-xl pb-4 pl-10 pt-4 md:pt-0">闪念配置</h2>
    <div class="w-full lg:w-[500px] md:ml-10">
      <el-form ref="formRef" :model="form" layout="vertical" size="large" v-loading="loading">
        <el-form-item label="个人名称">
          <el-input v-model="form.record_name" placeholder="请输入个人名称" />
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input
            v-model="form.record_info"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入个人介绍"
          />
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="w-full mt-4"
          :loading="btnLoading"
          @click="onSubmit"
          >保存</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RecordTheme',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getWebConfigDataAPI, editWebConfigDataAPI } from '@/api/config'
import type { Theme } from '@/types/app/config'

const loading = ref(false)
const btnLoading = ref(false)
const theme = ref<Theme>({} as Theme)
const form = reactive({
  record_name: '',
  record_info: '',
})

const getLayoutData = async () => {
  loading.value = true
  try {
    const { data } = await getWebConfigDataAPI<{ value: Theme }>('theme')
    theme.value = data.value
    form.record_name = data.value.record_name
    form.record_info = data.value.record_info
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  btnLoading.value = true
  try {
    await editWebConfigDataAPI('theme', {
      ...theme.value,
      record_name: form.record_name,
      record_info: form.record_info,
    })
    ElMessage.success('🎉 修改主题成功')
  } catch (e) {
    console.error(e)
  } finally {
    btnLoading.value = false
  }
}

onMounted(() => {
  getLayoutData()
})
</script>
