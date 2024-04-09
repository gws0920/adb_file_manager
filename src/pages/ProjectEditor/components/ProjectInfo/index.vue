<script lang="ts" setup>
import { ProjectTreeData } from '../../index.d'
import ProjectTree from './ProjectTree.vue'
import { Search } from '@vicons/carbon'

const props = defineProps<{
  root?: ProjectTreeData
  activeFileHandle?: FileSystemFileHandle
}>()
const emit = defineEmits<{
  (e: 'changeActiveFileHandle', handle?: FileSystemFileHandle): void
}>()
const searchVal = ref('')

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
        @change-active-file-handle="emit('changeActiveFileHandle', $event)"
      />
    </ul>
  </div>
  <el-empty v-else/>
</template>

<style lang="scss" scoped>

</style>
