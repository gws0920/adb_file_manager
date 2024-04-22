<script lang="ts" setup>
const props = defineProps<{
  fileHandle?: FileSystemFileHandle
}>()

const url = ref()

watch(() => props.fileHandle, async () => {
  if (props.fileHandle) {
    const file = await props.fileHandle.getFile()
    url.value = URL.createObjectURL(file)
  } else {
    URL.revokeObjectURL(url.value)
    url.value = ''
  }
}, { immediate: true })
</script>

<template>
  <img :src="url" alt="" srcset="">
</template>

<style lang="scss" scoped>
img {
  object-fit: contain;
}
</style>
