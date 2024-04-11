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
  },
  {
    path: '/WebUSBDevice',
    name: 'WebUSBDevice',
    redirect: '/WebUSBDevice/FileManager',
    component: () => import('@/pages/WebUSBDevice/index.vue'),
    meta: {
      title: 'ADB管理'
    },
    children: [
      {
        path: 'FileManager',
        name: 'FileManager',
        component: () => import('@/pages/WebUSBDevice/FileManager/index.vue'),
        meta: {
          title: '文件管理'
        }
      },
      {
        path: 'ADBRunner',
        name: 'ADBRunner',
        component: () => import('@/pages/WebUSBDevice/ADBRunner/index.vue'),
        meta: {
          title: '文件管理'
        }
      }
    ]
  }
]

export default routes
