<script lang="ts" setup>
import { Adb, AdbSyncEntry } from '@yume-chan/adb'
import { Folder, ArrowLeft, Document, CloudDownload, Delete, CloudUpload, Search, Settings } from '@vicons/carbon'
import dayjs from 'dayjs'
import { ElLoading } from 'element-plus'
import FileFilterConfig from '@/components/FileFilterConfig/index.vue'
import ConfigPreview from '@/components/FileFilterConfig/ConfigPreview.vue'

interface FileEntry extends AdbSyncEntry {
  isDirectory?: boolean
  checked?: boolean
}
const getAdb = inject<() => null | Adb>('getAdb', () => null)
const currentPath = ref<string[]>(['sdcard', 'DCIM', 'Camera'])
const files = ref<FileEntry[]>([])

const pathStr = computed({
  get: () => '/' + currentPath.value.join('/'),
  set: (val) => {
    currentPath.value = val.split('/').filter((v) => v !== '')
  }
})

const checkedAll = computed({
  get: () => files.value.every((item) => item.checked),
  set: (val) => files.value.forEach((item) => (item.checked = val))
})
const isIndeterminate = computed(() => {
  return !checkedAll.value && files.value.some((item) => item.checked)
})

const readdir = async (pathArr: string[]) => {
  const adb = getAdb()
  if (!adb) return []
  const sync = await adb.sync()
  const path = '/' + pathArr.join('/')
  const entries: FileEntry[] = (await sync.readdir(path))
  const folders: FileEntry[] = []
  const files: FileEntry[] = []
  for (let i = 0; i < entries.length; i++) {
    const isDirectory = await sync.isDirectory(path + '/' + entries[i].name)
    entries[i].isDirectory = isDirectory
    if (isDirectory) {
      folders.push(entries[i])
    } else {
      files.push(entries[i])
    }
  }
  const sortFn = (a: FileEntry, b: FileEntry) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  return [...folders.sort(sortFn), ...files.sort(sortFn)]
}

const clickItem = (item: FileEntry) => {
  if (!item.isDirectory) return
  currentPath.value.push(item.name)
  go()
}

const loading = ref(false)
const go = async () => {
  loading.value = true
  files.value = await readdir(currentPath.value)
  loading.value = false
}
const back = () => {
  currentPath.value.pop()
  go()
}

const download = async (item: FileEntry, dirHandle?: FileSystemDirectoryHandle) => {
  const adb = getAdb()
  const sync = await adb?.sync()
  dirHandle = dirHandle || await getLasterDirHandle() || await showDirectoryPicker() // 从缓存里拿
  if (!dirHandle || !sync) return
  const loading = ElLoading.service({ text: '正在下载' })
  if (item.isDirectory) {
    return downloadDeviceDir(sync, `${pathStr.value}/${item.name}`, dirHandle, (str) => {
      loading.setText(`正在下载 ${str}`)
    }).finally(() => {
      loading.close()
    })
  } else {
    loading.setText(`正在下载 ${item.name}`)
    return downloadDeviceFile(sync, `${pathStr.value}/${item.name}`, dirHandle).finally(() => {
      loading.close()
    })
  }
}

const downloadChecked = async () => {
  const adb = getAdb()
  const sync = await adb?.sync()
  const dirHandle = await getLasterDirHandle() || await showDirectoryPicker() // 从缓存里拿
  if (!dirHandle || !sync) return
  const loading = ElLoading.service({ text: '正在下载' })
  for (let i = 0; i < files.value.length; i++) {
    const item = files.value[i]
    if (!item.checked) continue
    if (item.isDirectory) {
      await downloadDeviceDir(sync, `${pathStr.value}/${item.name}`, dirHandle, (name) => loading.setText(`正在下载 ${name}`))
    } else {
      loading.setText(`正在下载 ${item.name}`)
      await downloadDeviceFile(sync, `${pathStr.value}/${item.name}`, dirHandle)
    }
  }
  loading.close()
}

const del = async (item: FileEntry) => {
  const adb = getAdb()
  if (!adb) return
  const loading = ElLoading.service({ text: '正在删除' })
  await adb.rm(pathStr.value + '/' + item.name, { recursive: true })
  await go()
  loading.close()
}

const deleteChecked = async () => {
  const adb = getAdb()
  if (!adb) return
  const loading = ElLoading.service({ text: '正在删除' })
  const targets = files.value.reduce((res: string[], item) => {
    if (item.checked) {
      res.push(`${pathStr.value}/${item.name}`)
    }
    return res
  }, [])
  await adb.rm(targets, { recursive: true })
  await go()
  loading.close()
}

const uploadFile = async () => {
  const fileHandles = await showOpenFilePicker({ multiple: true })
  const adb = getAdb()
  const sync = await adb?.sync()
  if (!sync) return
  const loading = ElLoading.service({ text: '正在写入' })
  for (let i = 0; i < fileHandles.length; i++) {
    const fileHandle = fileHandles[i]
    loading.setText(`正在写入 ${fileHandle.name}`)
    const file = await fileHandle.getFile()
    await uploadFileToDevice(sync, `${pathStr.value}/${fileHandle.name}`, file, (v) => loading.setText(`正在写入 ${fileHandle.name} (${v}%)`))
  }
  await go()
  loading.close()
}

// 快速选择
const showConfig = ref(false)

const bus = useEventBus(ADB_DEVICE_CHANGE)
bus.on(go)
onMounted(go)

</script>

<template>
  <div class="flex flex-col h-full flex-1 ml-2 w-full overflow-hidden">
    <div class="controls">
      <div class="flex w-full items-center justify-between">
        <el-input v-model="pathStr" class="flex-1 mr-2">
          <template #prepend>
            <el-button :icon="ArrowLeft" @click="back" />
          </template>
          <template #append>
            <el-button @click="go">Go</el-button>
          </template>
        </el-input>
        <el-input placeholder="搜索" :prefix-icon="Search" class="!w-300px"/>
      </div>
      <div class="flex my-2 w-full items-center justify-between">
        <div class="left">
          <el-tooltip placement="right-start">
            <template #content>
              <ConfigPreview config-key="config" />
            </template>
            <el-button-group>
              <el-button
                text
                bg
                :icon="Folder"
              >快速选择</el-button>
              <el-button
                text
                bg
                :icon="Settings"
                @click="showConfig = true"
              />
            </el-button-group>
          </el-tooltip>
        </div>
        <div class="right">
          <el-button :icon="CloudUpload" type="primary" @click="uploadFile">上传</el-button>
          <el-button
            :disabled="!files.some(item => item.checked)"
            :icon="CloudDownload"
            @click="downloadChecked"
          >下载</el-button>
          <el-button
            :disabled="!files.some(item => item.checked)"
            :icon="Delete"
            type="danger"
            @click="deleteChecked"
          >删除</el-button>
        </div>
      </div>
    </div>

    <ul v-if="files.length" v-loading="loading">
      <li class="header">
        <el-checkbox v-model="checkedAll" :indeterminate="isIndeterminate" size="small" />
        <code>名称</code>
        <code class="text-center">修改时间</code>
        <code class="text-center">大小</code>
        <code class="text-right">操作</code>
      </li>
      <li v-for="item in files" :key="item.name" @click="clickItem(item)">
        <el-checkbox v-model="item.checked" size="small" @click.stop/>
        <div class="flex items-center">
          <el-icon class="mr-2">
            <component :is="item.isDirectory ? Folder : Document"/>
          </el-icon>
          <code>{{ item.name }}</code>
        </div>
        <code class="second">{{ dayjs(dayjs.unix(Number(item.mtime))).format('YYYY-MM-DD HH:mm:ss') }}</code>
        <code class="second">{{ item.isDirectory ? '' : formatFileSize(Number(item.size)) }}</code>
        <div class="flex items-center justify-end">
          <el-icon class="ml-2" @click.stop="download(item)"><CloudDownload /></el-icon>
          <el-icon class="ml-2" @click.stop="del(item)" ><Delete /></el-icon>
        </div>
      </li>
    </ul>
    <el-empty v-else class="flex-1" description="无数据"/>

    <FileFilterConfig v-model:visible="showConfig" save-key="config" />
  </div>
</template>

<style lang="scss" scoped>
.controls {
  @apply flex flex-col items-center;
  border-bottom: 1px solid var(--el-border-color);
}
ul {
  @apply flex flex-col flex-1 h-0 overflow-auto items-center;
  li {
    @apply rounded mt-1 w-full grid gap-2 items-center;
    grid-template-columns: 20px 1fr 160px 100px 100px;
    padding: 2px 0.5rem;
    &:not(.header) {
      @apply cursor-pointer transition;
    }
    &:not(.header):hover {
      background-color: var(--el-fill-color-light);
    }
    &.header {
      color: var(--el-text-color-secondary);
    }
    code.second {
      @apply text-center;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
