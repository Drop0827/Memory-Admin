import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleDataAPI } from '@/api/article'
import useAssistant from '@/composables/useAssistant'
import { ElMessage } from 'element-plus'
import type { Article } from '@/types/app/article'

export default function useCreateArticle() {
  const route = useRoute()
  const id = computed(() => Number(route.query.id))
  const isDraftParams = computed(() => Boolean(route.query.draft))

  const loading = ref(false)
  const publishOpen = ref(false)

  const data = ref<Article>({} as Article)
  const content = ref('')

  const { list: assistantList } = useAssistant()

  const getArticleData = async () => {
    try {
      loading.value = true
      const res = await getArticleDataAPI(id.value)
      const article = res.data
      data.value = article
      content.value = article.content
    } catch (error) {
      console.error(error)
      ElMessage.error('获取文章失败')
    } finally {
      loading.value = false
    }
  }

  const init = () => {
    if (id.value) {
      getArticleData()
    } else {
      // Restore from local storage
      const saved = localStorage.getItem('article_content')
      if (saved) {
        content.value = saved
      }
    }
  }

  const saveToLocal = () => {
    if (content.value.trim().length >= 1) {
      localStorage.setItem('article_content', content.value)
      ElMessage.success('内容已保存到本地')
    } else {
      ElMessage.error('请输入文章内容')
    }
  }

  const handleNext = () => {
    if (content.value.trim().length >= 1) {
      publishOpen.value = true
    } else {
      ElMessage.error('请输入文章内容')
    }
  }

  // Auto save on Ctrl+S
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      saveToLocal()
    }
  }

  // AI Assistant logic can reside here or in view.
  // We'll keep it exposed.

  return {
    loading,
    data,
    content,
    publishOpen,
    id,
    isDraftParams,

    init,
    saveToLocal,
    handleNext,
    handleKeyDown,

    // Assistant
    assistantList,
  }
}
