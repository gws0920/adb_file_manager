<script lang="ts" setup>
import { Folder, Document, DocumentBlank, Aperture, FolderOpen /*, Json */ } from '@vicons/carbon'
import { ProjectTreeData, DirectoryNode, FileNode } from '../../index.d'
import Tree from './ProjectTree.vue'
const props = defineProps<{
  node?: ProjectTreeData
  activeFileHandle?: FileSystemFileHandle
  searchVal: string
}>()
const emit = defineEmits<{
  (e: 'changeActiveFileHandle', handle?: FileSystemFileHandle): void
}>()

const getNodeChildren = async (node: DirectoryNode) => {
  const children: ProjectTreeData[] = []
  for await (const value of node.handle.values()) {
    if (value.kind === 'directory') {
      children.unshift({
        handle: value,
        isOpened: false,
        isLoading: false
      })
    } else {
      children.push({ handle: value })
    }
  }
  return children
}

const icon = computed(() => {
  const node = props.node
  if (!node) return null
  if ('isLoading' in node && node.isLoading) return Aperture
  const { kind, name } = node.handle
  if ('isOpened' in node && kind === 'directory') {
    return node.isOpened ? FolderOpen : Folder
  }
  if (kind === 'file') {
    return /\.json$/i.test(name) ? Document : Document
  }
  return DocumentBlank
})

const clickNode = async (node: ProjectTreeData) => {
  if (node.handle.kind === 'directory') {
    const n = node as DirectoryNode
    if (n?.isLoading) return
    if (n.children === undefined) { // 第一次点击，加载children
      n.isLoading = true
      const children = await getNodeChildren(n)
      n.children = children
      n.isLoading = false
    }
    n.isOpened = !n.isOpened
  } else {
    const n = node as FileNode
    emit('changeActiveFileHandle', n.handle)
    setLasterFileHandle(n.handle)
  }
}

const isActive = ref(false)
watch(() => props.activeFileHandle, async () => {
  if (!props.activeFileHandle || !props.node?.handle) return
  isActive.value = await props.node?.handle.isSameEntry(props.activeFileHandle)
}, { immediate: true })

onMounted(async () => {
  if (!props.node) return
  const { handle } = props.node
  if (handle.kind === 'directory') {
    const node = props.node as DirectoryNode
    if (node.isOpened) {
      node.isLoading = true
      const children = await getNodeChildren(node)
      node.children = children
      node.isLoading = false
    }
  }
})
</script>

<template>
  <li v-if="props.node" class="flex flex-col">
    <div class="node-info" :class="{active: isActive}" @click="clickNode(props.node)">
      <el-icon v-if="icon" class="mr-2">
        <component :is="icon"/>
      </el-icon>
      <code> {{ props.node.handle.name }}</code>
    </div>
    <ul v-if="'children' in props.node && props.node.handle.kind === 'directory' && props.node.isOpened">
      <Tree
        v-for="node in props.node.children"
        :key="node.handle.name"
        :active-file-handle="props.activeFileHandle"
        :node="node"
        :search-val="props.searchVal"
        class="ml-4 w-max-content overflow-hidden"
        @change-active-file-handle="emit('changeActiveFileHandle', $event)"
      />
    </ul>
  </li>
</template>

<style lang="scss" scoped>
ul {
  @apply p-0;
  li {
    .node-info {
      @apply rounded cursor-pointer flex transition items-center;
      padding: 2px 0.5rem;
      &:hover {
        background-color: var(--el-fill-color-light);
      }
      &.active {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
      }
      code {
        @apply overflow-hidden whitespace-nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
