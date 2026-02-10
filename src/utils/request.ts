import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 配置项目API域名
export const baseURL = import.meta.env.VITE_PROJECT_API || 'http://localhost:8080/api'

// 创建 axios 实例
export const instance = axios.create({
  baseURL,
  timeout: 10000,
})

// 用于取消请求
const CancelToken = axios.CancelToken
const source = CancelToken.source()

let isHandling401Error = false

// 请求拦截
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Pinia persistence using vueuse/useStorage saves directly to localStorage key 'token'
    // But better to access via store instance if possible, or read localStorage directly matching the store config
    const token = localStorage.getItem('token')

    let isExpired = false
    if (token) {
      try {
        const payload = token.split('.')[1]
        if (payload) {
          const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
          const json = JSON.parse(window.atob(base64))
          if (json.exp && Date.now() >= json.exp * 1000) {
            isExpired = true
          }
        }
      } catch (e) {
        isExpired = true
      }
    }

    if (isExpired) {
      localStorage.removeItem('token')
    }

    // Remove quotes if it's a double-quoted string (useStorage behavior for strings)
    const cleanToken = token && !isExpired ? token.replace(/^"(.*)"$/, '$1') : ''

    if (cleanToken) config.headers['Authorization'] = `Bearer ${cleanToken}`

    return config
  },
  (err: AxiosError) => {
    ElMessage.error(err.message)
    return Promise.reject(err)
  },
)

// 响应拦截
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data?.code === 600) return res.data

    if (res.data?.code !== 200) {
      ElMessage.error(res.data?.message || '未知错误')
      return Promise.reject(res.data)
    }

    return res.data
  },
  (err: AxiosError) => {
    if (isHandling401Error) return Promise.reject(err)

    if (err.response?.status === 401) {
      isHandling401Error = true

      ElMessageBox.alert('🔒️ 登录已过期，请重新登录?', '暂无权限', {
        confirmButtonText: '去登录',
        callback: () => {
          const store = useUserStore()
          store.quitLogin()
          isHandling401Error = false
        },
      })

      return Promise.reject(err.response?.data)
    }

    ElMessage.error(err.message || '程序异常')
    return Promise.reject(err)
  },
)

export interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

const request = <T>(method: string, url: string, reqParams?: object): Promise<BaseResponse<T>> => {
  return instance.request<unknown, BaseResponse<T>>({
    method,
    url,
    ...reqParams,
    cancelToken: source.token,
  })
}

export default request
