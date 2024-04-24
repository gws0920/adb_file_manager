<script lang="ts" setup>
import routes from '@/router/routes'
import { Home } from '@vicons/carbon'
const router = useRouter()
const menus = computed(() => {
  return routes.filter(r => r.meta?.title)
})
const go = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <h1 class="flex items-center">
      <el-icon class="mr-2"><Home /></el-icon>
      Home
    </h1>
    <ul>
      <li
        v-for="r in menus"
        :key="r.path"
        class="item"
        @click="go(r.path)"
      >
        <el-icon v-if="r.meta?.icon" class="icon"><component :is="r.meta.icon" /></el-icon>
        <span :to="r.path">
          {{ r.meta?.title || r.name || r.path }}
        </span>
        <p>{{ r.meta?.desc }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.home {
  @apply flex flex-col h-full w-full p-4;
  box-sizing: border-box;
  ul {
    @apply m-auto max-w-1200px grid gap-4 grid-cols-3 translate-y-[-5rem];
    li {
      @apply rounded cursor-pointer flex flex-col p-4 transition items-center;
      border: 1px solid var(--el-border-color);
      .icon {
        @apply m-4;
        font-size: 38px;
      }
      span {
        @apply font-bold mt-4;
      }
      p {
        @apply text-sm;
        color: var(--el-text-color-secondary);
      }
      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }
}
</style>
