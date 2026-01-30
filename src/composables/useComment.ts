import { ref } from 'vue'
import { getCommentListAPI, delCommentDataAPI, addCommentDataAPI } from '@/api/comment'
import type { Comment } from '@/types/app/comment'
import { useUserStore, useWebStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'

export default function useComment() {
  const loading = ref(false)
  const initialLoading = ref(true)
  const btnLoading = ref(false)
  const list = ref<Comment[]>([])
  const comment = ref<Comment>({} as Comment)

  const isCommentModalOpen = ref(false)
  const isReplyModalOpen = ref(false)
  const replyInfo = ref('')

  const userStore = useUserStore()
  const webStore = useWebStore()

  const getCommentList = async (queryParams: FilterData = {}) => {
    try {
      if (!initialLoading.value) {
        loading.value = true
      }

      const res = await getCommentListAPI({ query: queryParams })
      const result = res.data

      if (Array.isArray(result)) {
        list.value = result
      } else {
        list.value = []
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('获取评论列表失败')
    } finally {
      initialLoading.value = false
      loading.value = false
    }
  }

  const delCommentData = (id: number) => {
    ElMessageBox.confirm('你确定要删除吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          loading.value = true
          await delCommentDataAPI(id)
          ElMessage.success('🎉 删除评论成功')
          await getCommentList()
        } catch (error) {
          console.error(error)
          ElMessage.error('删除失败')
        } finally {
          loading.value = false
        }
      })
      .catch(() => {})
  }

  const onHandleReply = async () => {
    if (!replyInfo.value.trim()) {
      ElMessage.warning('请输入回复内容')
      return
    }

    try {
      btnLoading.value = true
      await addCommentDataAPI({
        avatar: userStore.user.avatar,
        url: webStore.web.url,
        content: replyInfo.value,
        commentId: comment.value.id ?? 0,
        auditStatus: 1,
        email: userStore.user.email,
        name: userStore.user.name,
        articleId: comment.value.articleId ?? 0,
        createTime: new Date().getTime().toString(),
      } as Comment)

      ElMessage.success('🎉 回复评论成功')
      await getCommentList()
      isReplyModalOpen.value = false
      replyInfo.value = ''
    } catch (error) {
      console.error(error)
      ElMessage.error('回复失败')
    } finally {
      btnLoading.value = false
    }
  }

  const openDetailModal = (record: Comment) => {
    comment.value = record
    isCommentModalOpen.value = true
  }

  const openReplyModal = (record: Comment) => {
    comment.value = record
    isReplyModalOpen.value = true
  }

  // Initialize
  getCommentList()

  return {
    loading,
    initialLoading,
    btnLoading,
    list,
    comment,
    isCommentModalOpen,
    isReplyModalOpen,
    replyInfo,

    getCommentList,
    delCommentData,
    onHandleReply,
    openDetailModal,
    openReplyModal,
  }
}
