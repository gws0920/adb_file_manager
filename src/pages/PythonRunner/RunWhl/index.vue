<script lang="ts" setup>
const { pyodide } = usePyodide({ onLoaded: init })

const whlPath = new URL('/public/test_pkg-0.4-py3-none-any.whl', import.meta.url).href
const testImg = new URL('/public/test.jpg', import.meta.url).href

const sourceBlob = ref() // 原始图
const sourceUrl = computed(() => sourceBlob.value && URL.createObjectURL(sourceBlob.value))

const gray = ref<string>() // 灰度图

let pkg: any
const running = ref(false)
const run = async () => {
  if (!pkg) return ElMessage.warning('请等待加载完成')
  running.value = true
  const base64 = await blob2base64(sourceBlob.value)
  const res = pkg.get_gray_image(base64.replace('data:image/jpeg;base64,', ''))
  gray.value = `data:image/jpeg;base64,${res}`
  running.value = false
}

async function init () {
  if (!pyodide.value) return
  const response = await fetch(whlPath) // .zip, .whl, ...
  const buffer = await response.arrayBuffer()
  await pyodide.value.loadPackage(['opencv-python'])
  await pyodide.value.unpackArchive(buffer, 'wheel')
  pkg = await pyodide.value.pyimport('test_pkg')
  console.log('test_pkg 初始化完成')
}

const chooseImg = async () => {
  const [handle] = await showOpenFilePicker({
    types: [
      {
        description: 'Images',
        accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  })
  sourceBlob.value = await handle.getFile()
}

onMounted(async () => {
  sourceBlob.value = await fetch(testImg).then(res => res.blob())
})
</script>

<template>
  <div class="flex flex-col w-full p-2">
    <el-alert title="通过自定义的.whl实现获取图片的回读图" type="info"/>
    <el-button
      type="primary"
      class="my-2"
      :loading="running"
      @click="run"
    >Run</el-button>
    <div class="flex flex-1 h-0 overflow-hidden items-center justify-center">
      <div class="source" @click="chooseImg">
        <i>点击选择图片</i>
        <img :src="sourceUrl" alt="">
      </div>
      <img :src="gray" alt="" class="w-50%">
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  @apply max-w-full max-h-full;
  object-fit: contain;
}
.source {
  @apply cursor-pointer flex-shrink-0 w-[50%] relative;
  &:hover {
    i {
      @apply opacity-100;
    }
  }
  i {
    @apply flex h-full w-full opacity-0 transition top-0 left-0 absolute items-center justify-center;
    background-color: rgba($color: #000000, $alpha: 0.6);
  }
}
</style>
