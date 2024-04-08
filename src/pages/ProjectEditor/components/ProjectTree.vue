<script lang="ts" setup>
import { Folder, Document, DocumentBlank, Aperture, FolderOpen /*, Json */ } from '@vicons/carbon'
import { ProjectTreeData, DirectoryNode, FileNode } from '../index.d'
import Tree from './ProjectTree.vue'
const props = withDefaults(defineProps<{
  nodes?: ProjectTreeData[]
  activeFileHandle?: FileSystemFileHandle
}>(), { nodes: () => [] })
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

const getIcon = (node: ProjectTreeData) => {
  if ('isLoading' in node && node.isLoading) return Aperture
  const { kind, name } = node.handle
  if ('isOpened' in node && kind === 'directory') {
    return node.isOpened ? FolderOpen : Folder
  }
  if (kind === 'file') {
    return /\.json$/i.test(name) ? Document : Document
  }
  return DocumentBlank
}

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
  }
}

onMounted(async () => {
  for (let i = 0; i < props.nodes.length; i++) {
    const { handle } = props.nodes[i]
    if (handle.kind === 'directory') {
      const node = props.nodes[i] as DirectoryNode
      if (node.isOpened) {
        node.isLoading = true
        const children = await getNodeChildren(node)
        node.children = children
        node.isLoading = false
      }
    }
  }
})
</script>

<template>
  <ul>
    <li v-for="node in props.nodes" :key="node.handle.name" class="flex flex-col">
      <div class="node-info" :class="{active: node.handle === props.activeFileHandle}" @click="clickNode(node)">
        <el-icon class="mr-2">
          <component :is="getIcon(node)"/>
        </el-icon>
        <code> {{ node.handle.name }}</code>
      </div>
      <Tree
        v-if="'children' in node && node.handle.kind === 'directory' && node.isOpened"
        :active-file-handle="props.activeFileHandle"
        :nodes="node.children"
        class="ml-6 w-max-content overflow-hidden"
        @change-active-file-handle="handle => emit('changeActiveFileHandle', handle)"
      />
    </li>
  </ul>
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
