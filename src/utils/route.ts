import {
  LayoutDashboard,
  PenTool,
  LayoutGrid,
  Settings,
  Monitor,
  Folder,
  History,
  FileText,
  MessageSquare,
  Tags,
  Globe,
  Database,
  Map,
  Trash2,
  FileEdit,
  GalleryHorizontalEnd,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface RouteConfig {
  path: string
  title: string
  icon?: Component
}

const routeConfigMap: Record<string, RouteConfig> = {
  '/': { path: '/', title: '首页', icon: LayoutDashboard },
  '/create': { path: '/create', title: '发挥灵感', icon: PenTool },
  '/create_record': { path: '/create_record', title: '闪念', icon: PenTool },
  '/draft': { path: '/draft', title: '草稿箱', icon: FileEdit },
  '/decycle': { path: '/decycle', title: '回收站', icon: Trash2 },
  '/cate': { path: '/cate', title: '导航管理', icon: LayoutGrid },
  '/article': { path: '/article', title: '文章管理', icon: FileText },
  '/record': { path: '/record', title: '说说管理', icon: MessageSquare },
  '/tag': { path: '/tag', title: '标签管理', icon: Tags },
  '/comment': { path: '/comment', title: '评论管理', icon: MessageSquare },
  '/wall': { path: '/wall', title: '留言管理', icon: MessageSquare },
  '/web': { path: '/web', title: '网站管理', icon: Globe },
  '/swiper': { path: '/swiper', title: '轮播图管理', icon: GalleryHorizontalEnd },
  '/footprint': { path: '/footprint', title: '足迹管理', icon: Map },
  '/storage': { path: '/storage', title: '存储管理', icon: Database },
  '/setup': { path: '/setup', title: '项目配置', icon: Settings },
  '/file': { path: '/file', title: '文件管理', icon: Folder },
  '/iter': { path: '/iter', title: '项目更新记录', icon: History },
  '/work': { path: '/work', title: '工作台', icon: Monitor },
  '/assistant': { path: '/assistant', title: '助手管理', icon: LayoutGrid },
  '/config': { path: '/config', title: '项目配置', icon: Settings },
}

export const getRouteConfig = (pathname: string): RouteConfig | null => {
  if (routeConfigMap[pathname]) {
    return routeConfigMap[pathname]
  }
  for (const [path, config] of Object.entries(routeConfigMap)) {
    if (pathname.startsWith(path) && path !== '/') {
      return config
    }
  }
  return null
}
