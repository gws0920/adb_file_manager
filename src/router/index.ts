import routes from './routes'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

router.afterEach((to) => {
  const title = useTitle()
  title.value = (to.meta?.title as string) || '小工具'
})
export default router
