import { RouteRecordRaw } from 'vue-router'
import { Home, ApplicationWeb, ApplicationMobile } from '@vicons/carbon'
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
      title: '首页',
      icon: Home,
    }
  },
  {
    path: '/ProjectEditor',
    name: 'ProjectEditor',
    component: () => import('@/pages/ProjectEditor/index.vue'),
    meta: {
      title: '参数调试',
      icon: ApplicationWeb,
      desc: '基于File System API 在线编辑本地项目'
    }
  },
  {
    path: '/WebUSBDevice',
    name: 'WebUSBDevice',
    redirect: '/WebUSBDevice/FileManager',
    component: () => import('@/pages/WebUSBDevice/index.vue'),
    meta: {
      title: 'ADB管理',
      icon: ApplicationMobile,
      desc: '在线Android手机文件上传、下载、删除以及ADB命令执行'
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
          title: 'ADB Runner'
        }
      }
    ]
  }
]

export default routes
