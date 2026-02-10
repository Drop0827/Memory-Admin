<template>
  <div>
    <h2 class="text-xl pb-4 pl-10 pt-4 md:pt-0">网站配置</h2>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      layout="vertical"
      label-position="top"
      size="large"
      class="w-full lg:w-[500px] md:ml-10"
    >
      <el-form-item label="网站名称" prop="title">
        <el-input v-model="form.title" placeholder="Memory" />
      </el-form-item>
      <el-form-item label="网站副标题" prop="subhead">
        <el-input v-model="form.subhead" placeholder="花有重开日, 人无再少年" />
      </el-form-item>
      <el-form-item label="网站链接" prop="url">
        <el-input v-model="form.url" placeholder="https://github.com/Drop0827" />
      </el-form-item>
      <el-form-item label="网站图标" prop="favicon">
        <el-input v-model="form.favicon" placeholder="https://github.com/Drop0827.png" />
      </el-form-item>
      <el-form-item label="网站描述" prop="description">
        <el-input v-model="form.description" placeholder="记录前端、Python、Java点点滴滴" />
      </el-form-item>
      <el-form-item label="网站关键词" prop="keyword">
        <el-input v-model="form.keyword" placeholder="Java,前端,Python" />
      </el-form-item>
      <el-form-item label="底部信息" prop="footer">
        <el-input v-model="form.footer" placeholder="记录前端、Python、Java点点滴滴" />
      </el-form-item>
      <el-form-item label="ICP 备案号" prop="icp">
        <el-input v-model="form.icp" placeholder="豫ICP备2020031040号-1" />
      </el-form-item>
      <el-form-item label="网站创建时间" prop="create_time">
        <el-date-picker
          v-model="form.create_time"
          type="date"
          placeholder="选择日期"
          class="w-full"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w-full" :loading="loading" @click="onSubmit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SetupWeb',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { useWebStore } from '@/stores'
import { editWebConfigDataAPI } from '@/api/config'
import type { Config, Web } from '@/types/app/config'

const loading = ref(false)
const webStore = useWebStore()
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  subhead: '',
  url: '',
  favicon: '',
  description: '',
  keyword: '',
  footer: '',
  icp: '',
  create_time: null as Date | null,
})

const rules = reactive<FormRules>({
  title: [{ required: true, message: '网站名称不能为空', trigger: 'blur' }],
  subhead: [{ required: true, message: '网站副标题不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '网站链接不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '网站描述不能为空', trigger: 'blur' }],
  keyword: [{ required: true, message: '网站关键词不能为空', trigger: 'blur' }],
  footer: [{ required: true, message: '网站底部信息不能为空', trigger: 'blur' }],
})

const initForm = () => {
  const web = webStore.web
  form.title = web.title
  form.subhead = web.subhead
  form.url = web.url
  form.favicon = web.favicon
  form.description = web.description
  form.keyword = web.keyword
  form.footer = web.footer
  form.icp = web.icp || ''
  form.create_time = web.create_time ? dayjs(Number(web.create_time)).toDate() : null

  // Auto-fill user defaults if empty or legacy (ThriveX defaults)
  if (!form.title || form.title === 'ThriveX') {
    form.title = 'Memory'
  }
  if (!form.subhead || form.subhead.includes('现代化博客管理系统')) {
    form.subhead = '记录精彩每一刻'
  }
  if (!form.footer || form.footer.includes('ThriveX')) {
    form.footer = 'Copyright © 2026 Memory. All rights reserved.'
  }
  if (
    !form.description ||
    form.description.includes('ThriveX') ||
    form.description.includes('最好用的博客')
  ) {
    form.description = 'Memory Blog System'
  }
  if (!form.keyword || form.keyword.includes('宇阳')) {
    form.keyword = 'Memory,Blog,Life,Tech'
  }
  if (!form.icp || form.icp.includes('豫ICP')) {
    form.icp = ''
  }

  // Use the user provided "Website Logo" for favicon
  if (
    !form.favicon ||
    form.favicon.includes('liuyuyang.net') ||
    form.favicon.includes('github.com')
  ) {
    form.favicon = 'https://bu.dusays.com/2026/02/06/6985b746c93fd.png'
  }
  // Use localhost or current origin for URL if it points to original author
  if (!form.url || form.url.includes('liuyuyang.net')) {
    form.url = window.location.origin
  }
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const submitData = {
          ...form,
          create_time: form.create_time ? dayjs(form.create_time).valueOf() : undefined,
          id: (webStore.web as unknown as Config).id,
        }

        await editWebConfigDataAPI('web', submitData)
        ElMessage.success('🎉 编辑网站成功')
        webStore.setWeb(submitData as unknown as Web)
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  initForm()
})
</script>
