<script lang="ts" setup>
import { IConfig } from './index.d'
import { DEFAULT_CONFIG, TYPES, FILE_TYPES } from './const'

const props = defineProps<{
  configKey: string
}>()
const config = useLocalStorage<IConfig>(props.configKey, DEFAULT_CONFIG)

const hasEnableConfig = computed(() => {
  return Object.values(config.value).some((item) => item?.enable)
})

const formatEntryType = (types: string[]) => {
  return types.map((type) => {
    return TYPES.find((item) => item.value === type)?.label || '未知'
  }).join(' | ')
}

const formatFileType = (types: string[]) => {
  return types.map((type) => {
    return FILE_TYPES.find((item) => item.value === type)?.label || '未知'
  }).join(' | ')
}
</script>

<template>
  <div>
    <ul v-if="config && hasEnableConfig">
      <li v-if="config.entryType.enable">
        <span>类型: </span>
        <code>{{ formatEntryType(config.entryType.types) }}</code>
      </li>
      <li v-if="config.fileSize?.enable">
        <span>文件大小: </span>
        <code>{{ config.fileSize.min }} M  至  {{ config.fileSize.max }} M</code>
      </li>
      <li v-if="config.fileType?.enable">
        <span>文件类型: </span>
        <code>{{ formatFileType(config.fileType.types) }}</code>
      </li>
      <li v-if="config.mtime?.enable">
        <span>更新时间: </span>
        <code>{{ config.mtime.range.join(' 至 ') }}</code>
      </li>
    </ul>
    <el-empty v-else class="mx-6" description="无配置"/>
  </div>
</template>

<style lang="scss" scoped>
ul {
  @apply flex flex-col overflow-auto;
  li {
    @apply flex items-center;
    span {
      @apply font-bold mr-4 text-right opacity-80 w-5em;
    }
  }
}
</style>
