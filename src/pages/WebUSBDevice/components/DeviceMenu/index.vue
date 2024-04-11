<script lang="ts" setup>
import { Folder, Code } from '@vicons/carbon'
const isCollapse = ref(true)
const route = useRoute()
const defaultActive = computed(() => {
  return route.name || 'FileManager'
})
</script>

<template>
  <el-menu
    :default-active="defaultActive"
    :collapse="isCollapse"
    :router="true"
  >
    <el-menu-item index="FileManager" :route="{name: 'FileManager'}">
      <el-icon><Folder /></el-icon>
      <template #title>文件管理</template>
    </el-menu-item>
    <el-menu-item index="ADBRunner" :route="{name: 'ADBRunner'}">
      <el-icon><Code /></el-icon>
      <template #title>ADB指令</template>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>

</style>
