<template>
  <el-dialog
    v-model="visible"
    title="📢 系统通知"
    width="600px"
    class="login-notification-modal"
    :before-close="handleClose"
    align-center
  >
    <div class="py-4">
      <div class="text-center space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            ⭐ 喜欢 Memory 吗？
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            如果这个项目对你有帮助，欢迎在 GitHub 上给我们一个 Star！
            <br />
            你的支持是我们持续更新的最大动力 🚀
          </p>
        </div>

        <div class="pt-2">
          <el-button
            type="primary"
            size="large"
            @click="handleGoToGitHub"
            style="height: 48px; font-size: 16px; font-weight: 500"
          >
            <template #icon>
              <Github class="w-5 h-5" />
            </template>
            前往 GitHub 点 Star
          </el-button>
        </div>

        <div class="pt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Memory 是一个年轻、高颜值、全开源、永不收费的现代化博客管理系统
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
const SHOW_NOTIFICATION_KEY = 'show_login_notification'

export const setShowLoginNotification = () => {
  localStorage.setItem(SHOW_NOTIFICATION_KEY, 'true')
}

export const shouldShowLoginNotification = (): boolean => {
  return localStorage.getItem(SHOW_NOTIFICATION_KEY) === 'true'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Github } from 'lucide-vue-next'

defineOptions({
  name: 'SystemNotification',
})

const GITHUB_URL = 'https://github.com/LiuYuYang01/ThriveX-Admin'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])

const visible = computed({
  get: () => props.open,
  set: (val) => {
    if (!val) {
      handleClose()
    }
  },
})

const handleClose = () => {
  localStorage.removeItem(SHOW_NOTIFICATION_KEY)
  emit('close')
}

const handleGoToGitHub = () => {
  window.open(GITHUB_URL, '_blank')
}
</script>
