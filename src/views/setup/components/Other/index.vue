<template>
  <div>
    <h2 class="text-xl pb-4 pl-10 pt-4 md:pt-0">其他配置</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      layout="vertical"
      label-position="top"
      size="large"
      class="w-full lg:w-[500px] md:ml-10"
      v-loading="loading"
    >
      <el-form-item prop="baidu_token">
        <template #label>
          <div class="flex items-center justify-between w-full">
            <span>百度统计 Token</span>
            <a
              href="https://docs.liuyuyang.net/docs/项目部署/API/百度统计.html"
              target="_blank"
              class="hover:text-primary text-xs text-gray-400"
              >配置教程</a
            >
          </div>
        </template>
        <el-input v-model="form.baidu_token" placeholder="e5bf799a3e49312141c8b677b7bec1c2" />
      </el-form-item>

      <el-form-item prop="hcaptcha_key">
        <template #label>
          <div class="flex items-center justify-between w-full">
            <span>HCaptcha Key</span>
            <a
              href="https://docs.liuyuyang.net/docs/项目部署/API/人机验证.html"
              target="_blank"
              class="hover:text-primary text-xs text-gray-400"
              >配置教程</a
            >
          </div>
        </template>
        <el-input v-model="form.hcaptcha_key" placeholder="bfb82d04-e46a-4da0-9b6e-9adc052672c8" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="w-full" :loading="btnLoading" @click="onSubmit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SetupOther',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { editWebConfigDataAPI, getWebConfigDataAPI } from '@/api/config'

const loading = ref(false)
const btnLoading = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  baidu_token: '',
  hcaptcha_key: '',
})

const rules = reactive<FormRules>({
  hcaptcha_key: [{ required: true, message: 'HCaptcha Key 不能为空', trigger: 'blur' }],
})

const getConfigData = async () => {
  loading.value = true
  try {
    const { data } = await getWebConfigDataAPI('other')
    // @ts-expect-error data.value type mismatch
    Object.assign(form, data.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        await editWebConfigDataAPI('other', form)
        ElMessage.success('🎉 编辑配置成功')
      } catch (e) {
        console.error(e)
      } finally {
        btnLoading.value = false
      }
    }
  })
}

onMounted(() => {
  getConfigData()
})
</script>
