<script lang="ts" setup>
import RunnerMenu from './components/RunnerMenu/index.vue'

const router = useRouter()
const { loading } = usePyodide()
const goBack = () => {
  router.push('/')
}

</script>

<template>
  <div class="flex flex-col h-full w-full p-2 overflow-hidden">
    <div class="flex items-center">
      <el-page-header @back="goBack">
        <template #title>
          <span style="color: var(--el-text-color-regular)">
            返回首页
          </span>
        </template>
        <template #content>
          <code class="font-600 text-large mr-3">Python Runner</code>
        </template>
      </el-page-header>
    </div>
    <el-divider class="!mt-4 !mb-1" />
    <div v-loading="loading" class="flex flex-1 h-0 my-2 overflow-hidden">
      <RunnerMenu />
      <router-view v-if="!loading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
