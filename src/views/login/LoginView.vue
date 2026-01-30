<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4"
  >
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl"
      ></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="bg-white/50 backdrop-blur-sm rounded-md shadow-2xl p-8 border border-white/20">
        <div class="flex justify-center space-x-4 mb-8">
          <img src="/logo.png" alt="" class="w-12 h-12" />
          <div class="flex flex-col">
            <h1 class="font-bold text-lg text-slate-700">Memory</h1>
            <p class="text-slate-400 text-sm">现代化博客管理系统</p>
          </div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          layout="vertical"
          size="large"
          @keyup.enter="onSubmit"
        >
          <el-form-item prop="username" label="账号">
            <template #label>
              <span class="text-gray-700 font-medium">账号</span>
            </template>
            <el-input v-model="form.username" placeholder="请输入用户名" class="!h-12 !rounded-xl">
              <template #prefix>
                <User class="text-gray-400 w-4 h-4" />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password" label="密码" class="mb-6">
            <template #label>
              <span class="text-gray-700 font-medium">密码</span>
            </template>
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="请输入密码"
              class="!h-12 !rounded-xl"
            >
              <template #prefix>
                <Lock class="text-gray-400 w-4 h-4" />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item class="mb-6">
            <el-button
              type="primary"
              :loading="loading"
              class="w-full !h-12 !rounded-xl shadow-lg hover:shadow-xl font-medium text-base !bg-primary"
              @click="onSubmit"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="text-center mt-4">
        <p class="text-gray-500 text-sm">再小的个体，也有自己的品牌</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from 'lucide-vue-next'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { loginDataAPI } from '@/api/user'
import { useUserStore } from '@/stores'
import { setShowLoginNotification } from '@/components/SystemNotification/index.vue'

const router = useRouter()
const route = useRoute()
const store = useUserStore()

const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  password: '',
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const returnUrl = (route.query.returnUrl as string) || '/'

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const { data } = await loginDataAPI(form)
        store.setToken(data.token)
        store.setUser(data.user)
        store.setRole(data.role)

        setShowLoginNotification()

        ElNotification({
          type: 'success',
          title: '🎉 登录成功',
          message: `Hello ${data.user.name} 欢迎回来`,
        })

        router.push(returnUrl)
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  border-radius: 0.75rem;
  padding-left: 11px;
  padding-right: 11px;
  box-shadow: 0 0 0 1px #e5e7eb;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #60a5fa;
}
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>
