<script lang="ts" setup>
import ProjectTree from './components/ProjectTree.vue'
import FileContent from './components/FileContent.vue'
import { ProjectTreeData } from './index.d'

const roots = ref<ProjectTreeData[]>([])
const activeFileHandle = ref<FileSystemFileHandle>()
const loading = ref(false)
const router = useRouter()
const chooseProject = () => {
  if (!window.showDirectoryPicker) return ElMessage.error('当前浏览器不支持该功能')
  loading.value = true
  return window.showDirectoryPicker({ mode: 'readwrite' }).then(handle => {
    roots.value = [{
      handle,
      isOpened: true,
      isLoading: false,
    }]
  }).finally(() => {
    loading.value = false
  })
}
const goBack = () => {
  router.push('/')
}

onMounted(() => {
  navigator.storage.getDirectory().then(handle => {
    console.log(handle)
  })
})
</script>

<template>
  <div class="flex flex-col h-full w-full p-2 overflow-hidden">
    <div class="flex items-center">
      <el-page-header @back="goBack">
        <template #content>
          <code v-if="roots[0]" class="font-600 text-large mr-3">{{ roots[0]?.handle.name }}</code>
          <el-button
            type="primary"
            :loading="loading"
            text
            bg
            @click="chooseProject"
          >{{ roots.length ? '修改项目' : '选择项目文件夹' }}</el-button>
        </template>
      </el-page-header>
    </div>
    <el-divider class="!mt-4 !mb-1" />
    <div class="flex flex-1 h-0 my-2 overflow-hidden">
      <ProjectTree
        v-if="roots.length"
        :activeFileHandle="activeFileHandle"
        :nodes="roots"
        class="m-0 w-300px overflow-auto"
        @change-active-file-handle="activeFileHandle = $event"
      />
      <el-empty v-else class="m-0 w-300px overflow-auto" description="请先选择文件夹"/>
      <el-divider direction="vertical" class="!h-full" />
      <FileContent :file-handle="activeFileHandle" class="flex-1 w-0" />
    </div>
  </div>
</template>

<style scoped>

</style>
