<template>
  <div>
    <h2 class="text-xl pb-4 pl-10 pt-4 md:pt-0">个人配置</h2>
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="OHH" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="2720751424@qq.com" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="form.avatar" placeholder="https://github.com/Drop0827.png" />
      </el-form-item>
      <el-form-item label="介绍" prop="info">
        <el-input v-model="form.info" placeholder="互联网从不缺乏天才, 而努力才是最终的入场劵" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w-full" @click="onSubmit" :loading="btnLoading"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SetupMy',
}
</script>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores'
import { editUserDataAPI, getUserDataAPI } from '@/api/user'
import type { UserInfo } from '@/types/app/user'

const loading = ref(false)
const btnLoading = ref(false)
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  email: '',
  avatar: '',
  info: '',
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
  avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
  info: [{ required: true, message: '介绍不能为空', trigger: 'blur' }],
})

const getUserData = async () => {
  loading.value = true
  try {
    const { data } = await getUserDataAPI(userStore.user?.id)
    userStore.setUser(data)
    Object.assign(form, data)

    // Auto-fix defaults if legacy
    if (form.avatar === 'https://liuyuyang.net/logo.png' || !form.avatar) {
      form.avatar = 'https://github.com/Drop0827.png'
    }
    if (form.name === '宇阳') {
      form.name = 'OH|H'
    }
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
        await editUserDataAPI({
          id: userStore.user.id,
          role: userStore.user.role,
          ...form,
        } as UserInfo)
        await getUserData()
        ElMessage.success('🎉 修改用户信息成功')
      } catch (e) {
        console.error(e)
      } finally {
        btnLoading.value = false
      }
    }
  })
}

onMounted(() => {
  getUserData()
})
</script>
