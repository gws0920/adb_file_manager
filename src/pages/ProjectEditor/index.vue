<script lang="ts" setup>
import ProjectInfo from './components/ProjectInfo/index.vue'
import FileContent from './components/FileContent.vue'
import { DirectoryNode } from './index.d'

const root = ref<DirectoryNode>()
const activeFileHandle = ref<FileSystemFileHandle>()
const loading = ref(false)
const router = useRouter()
const chooseProject = () => {
  if (!window.showDirectoryPicker) return ElMessage.error('当前浏览器不支持该功能')
  loading.value = true
  return window.showDirectoryPicker({ mode: 'readwrite' }).then(handle => {
    root.value = {
      handle,
      isOpened: true,
      isLoading: false,
    }
    setLasterDirHandle(handle)
  }).finally(() => {
    loading.value = false
  })
}
const goBack = () => {
  router.push('/')
}

const getDir = async () => {
  const handle = await navigator.storage.getDirectory()
  console.log(handle)
  for await (const i of handle.values()) {
    console.log('dd', i)
  }
  // // Retrieve message sent to work from main script
  // const message = 'e.data'

  // // Get handle to draft file
  // const root = await navigator.storage.getDirectory()
  // const draftHandle = await root.getFileHandle('draft.txt', { create: true })
  // // Get sync access handle
  // const stream = await draftHandle.createWritable()
  // stream.write(message)
  // stream.close()
}

onMounted(async () => {
  const dirHandle = await getLasterDirHandle()
  if (!dirHandle) return
  root.value = {
    handle: dirHandle,
    isOpened: true,
    isLoading: false,
  }
  const fileHandle = await getLasterFileHandle()
  if (!fileHandle) return
  // TODO: 判断这个fileHandle是否在root下
  // TODO: 如果是的话，相关父级文件夹全部设为 isOpened = true
  activeFileHandle.value = fileHandle
})
</script>

<template>
  <div class="flex flex-col h-full w-full p-2 overflow-hidden">
    <div class="flex items-center">
      <el-page-header @back="goBack">
        <template #content>
          <code v-if="root" class="font-600 text-large mr-3">{{ root?.handle.name }}</code>
          <el-button
            type="primary"
            :loading="loading"
            text
            bg
            @click="chooseProject"
          >{{ root ? '修改项目' : '选择项目文件夹' }}</el-button>
        </template>
      </el-page-header>
      <el-button @click="getDir">dddd</el-button>
    </div>
    <el-divider class="!mt-4 !mb-1" />
    <div class="flex flex-1 h-0 my-2 overflow-hidden">
      <ProjectInfo
        :activeFileHandle="activeFileHandle"
        :root="root"
        class="m-0 w-300px overflow-auto"
        @change-active-file-handle="activeFileHandle = $event"
      />
      <el-divider direction="vertical" class="!h-full" />
      <FileContent :file-handle="activeFileHandle" class="flex-1 w-0" />
    </div>
  </div>
</template>

<style scoped>

</style>
