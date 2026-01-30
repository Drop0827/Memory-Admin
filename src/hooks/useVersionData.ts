import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Version {
  name: string
  tag_name: string
  html_url: string
}

export default function useVersionData() {
  const version = ref<Version>({} as Version)

  onMounted(() => {
    const getVersionData = async () => {
      try {
        const cachedVersion = sessionStorage.getItem('project_version')

        if (cachedVersion) {
          const parsedVersion = JSON.parse(cachedVersion)
          if (parsedVersion.tag_name && parsedVersion.html_url) {
            version.value = parsedVersion
            return
          }
        }

        const { data } = await axios.get(
          'https://api.github.com/repos/LiuYuYang01/ThriveX-Admin/releases/latest',
        )
        version.value = data
        sessionStorage.setItem('project_version', JSON.stringify(data))
      } catch (error) {
        console.error('获取版本信息失败:', error)
      }
    }

    getVersionData()
  })

  return version
}
