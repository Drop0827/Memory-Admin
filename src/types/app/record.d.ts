export interface Record {
  id?: number
  content: string
  images?: string | string[] // NOTE: 图片为可选字段
  createTime?: string | Dayjs
}
