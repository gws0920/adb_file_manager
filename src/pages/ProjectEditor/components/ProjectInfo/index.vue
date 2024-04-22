<script lang="ts" setup>
import { ProjectTreeData, DirectoryNode } from '../../index.d'
import ProjectTree from './ProjectTree.vue'
import ContentMenu from '@/components/ContentMenu/index.vue'
import { MenuItem } from '@/components/ContentMenu/index.d'
import { Search, Delete, Edit, FolderMoveTo } from '@vicons/carbon'

const props = defineProps<{
  root?: ProjectTreeData
  activeFileHandle?: FileSystemFileHandle
}>()
const emit = defineEmits<{
  (e: 'changeActiveFileHandle', handle?: FileSystemFileHandle): void
}>()
const searchVal = ref('')

// 右键菜单部分
const trigger = ref()
const contentMenuNode = ref<ProjectTreeData | null>(null)
const showMenu = (node: ProjectTreeData, e?: MouseEvent) => {
  if (e) {
    trigger.value = e.target
    contentMenuNode.value = node
  } else {
    trigger.value = null
    contentMenuNode.value = null
  }
}
const menus = computed<MenuItem[]>(() => {
  if (!contentMenuNode.value) return []
  if (contentMenuNode.value?.handle.kind === 'file') {
    return [
      { label: '重命名', icon: Edit, fn: () => {}, disabled: true },
      { label: '移动到...', icon: FolderMoveTo, fn: () => {}, disabled: true },
      { label: '删除文件', icon: Delete, fn: deleteHandle, topDivider: true },
    ] as MenuItem[]
  } else {
    return [
      { label: '重命名', icon: Edit, fn: () => {}, disabled: true },
      { label: '移动到...', icon: FolderMoveTo, fn: () => {}, disabled: true },
      { label: '删除目录', icon: Delete, fn: deleteHandle, topDivider: true },
    ] as MenuItem[]
  }
})

const deleteHandle = async () => {
  if (!contentMenuNode.value) return
  const { handle, parent } = contentMenuNode.value
  if (!parent) return

  const isCancel = await ElMessageBox.confirm(
    `确定要删除 ${handle.name} 吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => false).catch(() => true)
  if (isCancel) return
  const i = await findHandleIndexInParent(handle, parent)
  await parent.handle.removeEntry(handle.name, { recursive: true })
  i > -1 && parent.children?.splice(i, 1)
  ElMessage.success(`${handle.name} 删除成功`)
}

const findHandleIndexInParent = async (target: FileSystemDirectoryHandle | FileSystemFileHandle, parent: DirectoryNode) => {
  if (!parent?.children) {
    return -1
  }
  for (let i = 0; i < parent.children.length; i++) {
    const { handle } = parent.children[i]
    const isSame = await handle.isSameEntry(target)
    if (isSame) return i
  }
  return -1
}
</script>

<template>
  <div v-if="props.root" class="flex flex-col">
    <div class="flex items-center">
      <el-input v-model="searchVal" :prefix-icon="Search" placeholder="搜索暂未实现"/>
    </div>
    <ul class="m-0 mt-2 w-300px overflow-auto">
      <ProjectTree
        :activeFileHandle="activeFileHandle"
        :node="props.root"
        :search-val="searchVal"
        :content-menu-node="contentMenuNode"
        transition=""
        @change-active-file-handle="emit('changeActiveFileHandle', $event)"
        @showMenu="showMenu"
      />
    </ul>
    <ContentMenu v-model:trigger="trigger" :menus="menus" />
  </div>
  <el-empty v-else/>
</template>

<style lang="scss" scoped>

</style>
