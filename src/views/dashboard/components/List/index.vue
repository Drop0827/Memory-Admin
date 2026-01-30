<template>
  <div class="mb-6">
    <div class="text-center text-xs text-[#e0e0e0] mb-2">
      {{ dayjs(+(currentItem.createTime || 0)).format('YYYY-MM-DD HH:mm:ss') }}
    </div>

    <div
      class="flex justify-between md:p-7 !pt-3 rounded-md transition-colors bg-white dark:bg-boxdark shadow-sm"
    >
      <div class="flex">
        <img
          v-if="currentItem.avatar || currentItem.image"
          :src="currentItem.avatar || currentItem.image"
          class="w-12 h-12 p-0.5 border border-stroke rounded-full object-cover"
        />
        <RandomAvatar v-else class="w-12 h-12 p-0.5 border border-stroke rounded-full" />

        <div
          class="flex flex-col justify-center ml-4 px-4 py-2 min-w-[300px] text-xs md:text-sm bg-[#F9F9FD] dark:bg-[#4e5969] rounded-md"
        >
          <template v-if="type === 'link'">
            <div>名称：{{ currentItem.title }}</div>
            <div>介绍：{{ currentItem.description }}</div>
            <div>类型：{{ currentItem.type?.name }}</div>
            <div>
              网站：
              <a
                v-if="currentItem.url"
                :href="currentItem.url"
                target="_blank"
                class="hover:text-primary font-bold dark:text-white"
                >{{ currentItem.url }}</a
              >
              <span v-else>无网站</span>
            </div>
          </template>
          <template v-else-if="type === 'comment'">
            <div>名称：{{ currentItem.name }}</div>
            <div>内容：{{ currentItem.content }}</div>
            <div>
              网站：
              <a
                v-if="currentItem.url"
                :href="currentItem.url"
                target="_blank"
                class="hover:text-primary font-bold transition-none dark:text-white"
                >{{ currentItem.url }}</a
              >
              <span v-else>无网站</span>
            </div>
            <div>
              所属文章：
              <a
                v-if="currentItem.articleId"
                :href="`${web.url}/article/${currentItem.articleId}`"
                target="_blank"
                class="hover:text-primary transition-none dark:text-white"
              >
                {{ currentItem.articleTitle || '暂无' }}
              </a>
              <span v-else>暂无</span>
            </div>
          </template>
          <template v-else>
            <div>名称：{{ currentItem.name }}</div>
            <div>内容：{{ currentItem.content }}</div>
            <div>邮箱：{{ currentItem.email || '暂无' }}</div>
          </template>
        </div>
      </div>

      <div class="flex items-end ml-15">
        <el-dropdown trigger="click" @command="handleCommand">
          <div
            class="flex justify-evenly items-center bg-[#F9F9FD] dark:bg-[#4e5969] w-10 h-5 mb-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span class="inline-block w-1.5 h-1.5 bg-[#b5c2d3] rounded-full"></span>
            <span class="inline-block w-1.5 h-1.5 bg-[#b5c2d3] rounded-full"></span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="ok">通过</el-dropdown-item>
              <el-dropdown-item v-if="type !== 'link'" command="reply">回复</el-dropdown-item>
              <el-dropdown-item command="dismiss">驳回</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      v-model="isModalOpen"
      :title="btnType === 'reply' ? '回复内容' : '驳回原因'"
      width="500px"
    >
      <el-input
        v-model="inputText"
        type="textarea"
        :placeholder="btnType === 'reply' ? '请输入回复内容' : '请输入驳回原因'"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
      <template #footer>
        <el-button @click="isModalOpen = false">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardList',
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import RandomAvatar from '@/components/RandomAvatar/index.vue'
import { useUserStore, useWebStore } from '@/stores'
import { auditCommentDataAPI, delCommentDataAPI, addCommentDataAPI } from '@/api/comment'
import { auditWallDataAPI, delWallDataAPI } from '@/api/wall'
import { delLinkDataAPI, auditWebDataAPI } from '@/api/web'
import { sendDismissEmailAPI, sendReplyWallEmailAPI } from '@/api/email'
import type { Comment } from '@/types/app/comment'
import type { Wall } from '@/types/app/wall'
import type { Web } from '@/types/app/web'

// Unified type for template
type DashboardItem = Partial<Comment> &
  Partial<Wall> &
  Partial<Web> & { id: number; createTime?: string | number }

const props = defineProps<{
  item: Comment | Wall | Web
  type: 'comment' | 'link' | 'wall'
  loading: boolean
}>()

const emit = defineEmits(['refresh', 'update:loading'])

const userStore = useUserStore()
const webStore = useWebStore()
const web = computed(() => webStore.web)
const user = computed(() => userStore.user)

// Computed item for template usage to avoid union type errors
const currentItem = computed(() => props.item as unknown as DashboardItem)

const btnLoading = ref(false)
const isModalOpen = ref(false)
const btnType = ref('')
const inputText = ref('')

const handleCommand = (command: string) => {
  if (command === 'ok') {
    handleApproval()
  } else if (command === 'reply') {
    btnType.value = 'reply'
    inputText.value = ''
    isModalOpen.value = true
  } else if (command === 'dismiss') {
    btnType.value = 'dismiss'
    inputText.value = ''
    isModalOpen.value = true
  }
}

const handleApproval = async () => {
  emit('update:loading', true)
  try {
    if (props.type === 'link') {
      await auditWebDataAPI(props.item.id!)
    } else if (props.type === 'comment') {
      await auditCommentDataAPI(props.item.id!)
    } else if (props.type === 'wall') {
      await auditWallDataAPI(props.item.id!)
    }
    emit('refresh', props.type)
    if (btnType.value !== 'reply') ElMessage.success('🎉 审核成功')
  } catch (e) {
    console.error(e)
  } finally {
    emit('update:loading', false)
  }
}

const handleConfirm = async () => {
  if (btnType.value === 'reply') {
    handleReply()
  } else {
    handleDismiss()
  }
}

const handleReply = async () => {
  btnLoading.value = true
  try {
    await handleApproval() // Approve first

    if (props.type === 'comment') {
      const item = props.item as Comment
      await addCommentDataAPI({
        avatar: user.value.avatar,
        url: web.value.url,
        content: inputText.value,
        commentId: item.id!,
        auditStatus: 1,
        email: user.value.email || null,
        name: user.value.name,
        articleId: item.articleId!,
        createTime: new Date().getTime().toString(),
      })
    }

    if (props.type === 'wall') {
      const item = props.item as Wall
      await sendReplyWallEmailAPI({
        to: item.email,
        recipient: item.name,
        your_content: item.content,
        reply_content: inputText.value,
        time: dayjs(+(item.createTime || 0)).format('YYYY-MM-DD HH:mm:ss'),
        url: web.value.url + '/wall/all',
      })
    }

    emit('refresh', props.type)
    ElMessage.success('🎉 回复成功')
    isModalOpen.value = false
    inputText.value = ''
  } catch (e) {
    console.error(e)
  } finally {
    btnLoading.value = false
  }
}

const handleDismiss = async () => {
  btnLoading.value = true
  try {
    if (props.type === 'link') await delLinkDataAPI(props.item.id!)
    else if (props.type === 'comment') await delCommentDataAPI(props.item.id!)
    else if (props.type === 'wall') await delWallDataAPI(props.item.id!)

    if (inputText.value.trim().length) {
      await sendDismissEmail()
    }

    emit('refresh', props.type)
    ElMessage.success('🎉 驳回成功')
    isModalOpen.value = false
    inputText.value = ''
  } catch (e) {
    console.error(e)
  } finally {
    btnLoading.value = false
  }
}

const sendDismissEmail = async () => {
  let email_info = { name: '', type: '', url: '' }
  switch (props.type) {
    case 'link': {
      const item = props.item as Web
      email_info = { name: item.title, type: '友链', url: `${web.value.url}/friend` }
      break
    }
    case 'comment': {
      const item = props.item as Comment
      email_info = {
        name: item.name,
        type: '评论',
        url: `${web.value.url}/article/${item.articleId}`,
      }
      break
    }
    case 'wall': {
      const item = props.item as Wall
      email_info = { name: item.name, type: '留言', url: `${web.value.url}/wall/all` }
      break
    }
  }

  const commonItem = props.item as { email?: string }
  if (commonItem.email) {
    await sendDismissEmailAPI({
      to: commonItem.email,
      content: inputText.value,
      recipient: email_info.name,
      subject: `${email_info.type}驳回通知`,
      time: dayjs().format('YYYY年MM月DD日 HH:mm'),
      type: email_info.type,
      url: email_info.url,
    })
  }
}
</script>
