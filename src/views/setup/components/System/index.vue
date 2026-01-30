<template>
  <div>
    <h2 class="text-xl pb-4 pl-10 pt-4 md:pt-0">账户配置</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      layout="vertical"
      label-position="top"
      size="large"
      class="w-full lg:w-[500px] md:ml-10"
    >
      <el-form-item label="管理员账号" prop="newUsername">
        <el-input v-model="form.newUsername" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="管理员旧密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          show-password
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="管理员新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          show-password
          placeholder="请输入新密码"
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
  name: 'SetupSystem',
}
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores'
import { editAdminPassAPI } from '@/api/user'

const store = useUserStore()
const loading = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  newUsername: store.user?.username || '',
  oldPassword: '',
  newPassword: '',
})

const rules = reactive<FormRules>({
  newUsername: [
    { required: true, message: '管理员账号不能为空', trigger: 'blur' },
    { min: 5, max: 16, message: '账号限制在5 ~ 16个字符', trigger: 'blur' },
  ],
  oldPassword: [
    { required: true, message: '管理员旧密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '密码限制在6 ~ 16个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '管理员新密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '密码限制在6 ~ 16个字符', trigger: 'blur' },
  ],
})

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await editAdminPassAPI({
          ...form,
          oldUsername: store.user?.username || '',
        })

        ElMessageBox.alert('🔒️ 修改成功，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            store.quitLogin()
          },
        })
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
