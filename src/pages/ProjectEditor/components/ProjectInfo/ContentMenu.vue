<script lang="ts" setup>
import { ProjectTreeData, DirectoryNode } from '../../index.d'
import { Delete, Edit } from '@vicons/carbon'
import { ClickOutside as vClickOutside } from 'element-plus'

const props = defineProps<{
  trigger?: HTMLElement
  node?: ProjectTreeData | null
}>()
const emit = defineEmits<{
  (e: 'update:trigger', trigger: null): void
  (e: 'update:node', node: null): void
}>()
const popoverRef = ref()
const visible = computed(() => !!props.trigger)

const menus = computed(() => {
  if (!props.node) return []
  if (props.node?.handle.kind === 'file') {
    return [
      { label: '删除文件', icon: Delete, fn: deleteHandle },
      { label: '重命名', icon: Edit, fn: () => {} },
    ]
  } else {
    return [
      { label: '删除目录', icon: Delete, fn: deleteHandle },
      { label: '重命名', icon: Edit, fn: () => {} },
    ]
  }
})

const deleteHandle = async () => {
  if (!props.node) return
  const { handle, parent } = props.node
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

const clickMenu = async (item: any) => {
  await item.fn()
  clickOutside()
}

const clickOutside = () => {
  emit('update:trigger', null)
  emit('update:node', null)
}
</script>

<template>
  <el-popover
    ref="popoverRef"
    :virtual-ref="props.trigger"
    :visible="visible"
    virtual-triggering
    popper-class="content-menu"
    placement="bottom-end"
  >
    <ul v-click-outside="clickOutside" class="flex flex-col">
      <li v-for="item in menus" :key="item.label" @click="clickMenu(item)">
        <el-icon class="mr-2"> <component :is="item.icon" /> </el-icon>
        <span> {{ item.label }} </span>
      </li>
    </ul>
  </el-popover>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
  li {
    @apply rounded cursor-pointer flex p-2 transition items-center;
    font-size: 14px;
    color: var(--el-text-color-regular);
    &:hover {
      background-color: var(--el-fill-color);
      color: var(--el-color-primary);
    }
  }
}
</style>

<style lang="scss">
.content-menu {
  --el-popover-padding: 8px !important;
}
</style>
