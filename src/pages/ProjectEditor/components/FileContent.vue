<script lang="ts" setup>
const props = defineProps<{
  fileHandle?: FileSystemFileHandle
}>()

const content = ref('')

watch(() => props.fileHandle, async () => {
  if (!props.fileHandle) {
    content.value = ''
  } else {
    content.value = await getFileContentByHandle(props.fileHandle)
  }
})

const saving = ref(false)
const save = () => {
  if (!props.fileHandle) return
  const fileHandle = props.fileHandle
  saving.value = true
  fileHandle.createWritable().then(writable => {
    writable.write(content.value)
    writable.close()
    ElMessage.success('保存成功')
  }).finally(() => {
    saving.value = false
  })
}

</script>

<template>
  <div class="flex flex-col">
    <template v-if="props.fileHandle">
      <div class="flex mb-2 items-center justify-end">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
      <el-input
        v-model="content"
        class="content-input"
        show-word-limit
        :autosize="false"
        resize="none"
        type="textarea"
      />
    </template>
    <el-empty v-else class="flex-1"/>
  </div>
</template>

<style lang="scss" scoped>
.content-input {
  @apply h-full flex-1 h-0 overflow-auto;
  :deep(.el-textarea__inner) {
    @apply h-full;
  }
}
</style>
