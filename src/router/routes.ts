import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/ProjectEditor',
    name: 'ProjectEditor',
    component: () => import('@/pages/ProjectEditor/index.vue'),
    meta: {
      title: '文件编辑器'
    }
  }
]

export default routes
