<script lang="ts" setup>
import { Code } from '@vicons/carbon'
const isCollapse = ref(false)
const route = useRoute()
const defaultActive = computed(() => {
  return route.name || 'SimpleRunner'
})
</script>

<template>
  <el-menu
    :default-active="defaultActive"
    :collapse="isCollapse"
    :router="true"
  >
    <el-menu-item index="SimpleRunner" :route="{name: 'SimpleRunner'}">
      <el-icon><Code /></el-icon>
      <template #title>运行简单Python</template>
    </el-menu-item>
    <el-menu-item index="ADBRunner" :route="{name: 'ADBRunner'}" :disabled="true">
      <el-icon><Code /></el-icon>
      <template #title>opencv</template>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>

</style>
