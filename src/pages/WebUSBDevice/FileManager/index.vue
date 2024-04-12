<script lang="ts" setup>
import { Adb, AdbSyncEntry } from '@yume-chan/adb'
import { Folder, ArrowLeft, Document, CloudDownload, Delete } from '@vicons/carbon'
import dayjs from 'dayjs'

interface FileEntry extends AdbSyncEntry {
  isDirectory?: boolean
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

const clickItem = (item: AdbSyncEntry) => {
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

const bus = useEventBus(ADB_DEVICE_CHANGE)
bus.on(go)
onMounted(go)
</script>

<template>
  <div class="flex flex-col h-full flex-1 ml-2 w-full overflow-hidden">
    <div class="controls">
      <el-input v-model="pathStr">
        <template #prepend>
          <el-button :icon="ArrowLeft" @click="back" />
        </template>
        <template #append>
          <el-button @click="go">Go</el-button>
        </template>
      </el-input>
    </div>

    <ul v-if="files.length" class="flex flex-col flex-1 h-0 overflow-auto">
      <li v-for="item in files" :key="item.name" @click="clickItem(item)">
        <div class="flex items-center">
          <el-icon class="mr-2">
            <component :is="item.isDirectory ? Folder : Document"/>
          </el-icon>
          <code>{{ item.name }}</code>
        </div>
        <code>{{ dayjs(dayjs.unix(Number(item.mtime))).format('YYYY-MM-DD hh:mm:ss') }}</code>
        <code>{{ item.isDirectory ? '' : formatFileSize(Number(item.size)) }}</code>
        <div class="flex items-center justify-end">
          <el-icon class="ml-2"><CloudDownload /></el-icon>
          <el-icon class="ml-2"><Delete /></el-icon>
        </div>
      </li>
    </ul>
    <el-empty v-else class="flex-1" description="无数据"/>
  </div>
</template>

<style lang="scss" scoped>
ul {
  li {
    @apply rounded cursor-pointer mt-1 grid transition gap-2;
    grid-template-columns: 1fr 160px 100px 100px;
    padding: 2px 0.5rem;
    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }
}
</style>
