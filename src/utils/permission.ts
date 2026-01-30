import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

// 判断是否有权限
export const useHasPermission = (code: string) => {
  const store = useUserStore()
  const { permission } = storeToRefs(store)
  return permission.value?.some((p) => p.name === code)
}

// Since useHasPermission depends on store, and this object is created immediately on import,
// we must ensure standard keys are functions or getters if we want reactivity.
// However, the original usage was: useHasPermission('code').
// To maintain compatibility but use the store, we'll keep the function.
// But the object below was pre-calculating permissions.
// In Vue/Pinia, we can't pre-calculate outside a component setup usually unless store is ready.
// We will export a generic checker object that invokes the function.

const check = (code: string) => useHasPermission(code)

export default {
  user: {
    add: () => check('user:add'),
    del: () => check('user:del'),
    edit: () => check('user:edit'),
    info: () => check('user:info'),
    list: () => check('user:list'),
    pass: () => check('user:pass'),
  },
  data: {
    add: () => check('data:add'),
    del: () => check('data:del'),
  },
  article: {
    add: () => check('article:add'),
    del: () => check('article:del'),
    reduction: () => check('article:reduction'),
    edit: () => check('article:edit'),
  },
  cate: {
    add: () => check('cate:add'),
    del: () => check('cate:del'),
    edit: () => check('cate:edit'),
  },
  comment: {
    del: () => check('comment:del'),
    edit: () => check('comment:edit'),
    audit: () => check('comment:audit'),
  },
  config: {
    edit: () => check('config:edit'),
  },
  email: {
    dismiss: () => check('email:dismiss'),
  },
  file: {
    info: () => check('file:info'),
    dir: () => check('file:dir'),
    list: () => check('file:list'),
    add: () => check('file:add'),
    del: () => check('file:del'),
  },
  oss: {
    add: () => check('oss:add'),
    del: () => check('oss:del'),
    edit: () => check('oss:edit'),
    info: () => check('oss:info'),
    list: () => check('oss:list'),
    enable: () => check('oss:enable'),
    getEnableOss: () => check('oss:getEnableOss'),
    getPlatform: () => check('oss:getPlatform'),
  },
  record: {
    add: () => check('record:add'),
    del: () => check('record:del'),
    edit: () => check('record:edit'),
  },
  role: {
    add: () => check('role:add'),
    del: () => check('role:del'),
    edit: () => check('role:edit'),
    info: () => check('role:info'),
    list: () => check('role:list'),
    bindingRoute: () => check('role:bindingRoute'),
  },
  route: {
    add: () => check('route:add'),
    del: () => check('route:del'),
    edit: () => check('route:edit'),
    info: () => check('route:info'),
    list: () => check('route:list'),
  },
  swiper: {
    add: () => check('swiper:add'),
    del: () => check('swiper:del'),
    edit: () => check('swiper:edit'),
  },
  tag: {
    add: () => check('tag:add'),
    del: () => check('tag:del'),
    edit: () => check('tag:edit'),
  },
  wall: {
    del: () => check('wall:del'),
    edit: () => check('wall:edit'),
    audit: () => check('wall:audit'),
  },
  permission: {
    add: () => check('permission:add'),
    del: () => check('permission:del'),
    edit: () => check('permission:edit'),
    info: () => check('permission:info'),
    list: () => check('permission:list'),
  },
}
