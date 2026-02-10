import {
  LayoutDashboard,
  PenTool,
  LayoutGrid,
  Settings,
  Monitor,
  Folder,
  History,
} from 'lucide-vue-next'

export const menuGroups = [
  {
    name: '',
    items: [
      {
        icon: LayoutDashboard,
        label: '仪表盘',
        route: 'dashboard',
        path: '/',
      },
      {
        icon: PenTool,
        label: '创作',
        route: 'write',
        path: '#',
        children: [
          { label: '谱写', route: 'create', path: '/create' },
          { label: '闪念', route: 'create_record', path: '/create_record' },
          { label: '草稿箱', route: 'draft', path: '/draft' },
          { label: '回收站', route: 'recycle', path: '/decycle' },
        ],
      },
      {
        icon: LayoutGrid,
        label: '管理',
        route: 'manage',
        path: '#',
        children: [
          { label: '文章管理', route: 'article', path: '/article' },
          { label: '助手管理', route: 'assistant', path: '/assistant' },
          { label: '说说管理', route: 'record', path: '/record' },
          { label: '标签管理', route: 'tag', path: '/tag' },
          { label: '评论管理', route: 'comment', path: '/comment' },
          { label: '留言管理', route: 'wall', path: '/wall' },
          { label: '导航管理', route: 'cate', path: '/cate' },
          { label: '网站管理', route: 'web', path: '/web' },
          { label: '轮播图管理', route: 'swiper', path: '/swiper' },
          { label: '足迹管理', route: 'footprint', path: '/footprint' },
          { label: '存储管理', route: 'storage', path: '/storage' },
          { label: '项目配置', route: 'config', path: '/config' },
        ],
      },
      {
        icon: Settings,
        label: '系统',
        route: 'setup',
        path: '/setup',
      },
    ],
  },
  {
    name: 'New',
    items: [
      {
        icon: Monitor,
        label: '工作台',
        route: 'work',
        path: '/work',
      },
      {
        icon: Folder,
        label: '文件系统',
        route: 'file',
        path: '/file',
      },
      {
        icon: History,
        label: '更新日志',
        route: 'iter',
        path: '/iter',
      },
    ],
  },
]
