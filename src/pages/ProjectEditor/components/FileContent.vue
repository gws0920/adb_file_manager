<script lang="ts" setup>
import { editor } from 'monaco-editor'

editor.defineTheme('darkTheme', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ token: '', background: '#141414' }],
  colors: {
    'editor.background': '#141414'
  }
})
editor.setTheme('darkTheme')

let editorBox: editor.IStandaloneCodeEditor

const props = defineProps<{
  fileHandle?: FileSystemFileHandle
}>()

const content = ref('')

watch(() => props.fileHandle, async () => {
  if (!props.fileHandle) {
    content.value = ''
  } else {
    initEditor()
  }
})

const editorContainer = ref<HTMLDivElement>()

const initEditor = async () => {
  if (editorBox) {
    editorBox.dispose?.()
  }
  if (!editorContainer.value || !props.fileHandle) return
  content.value = await getFileContentByHandle(props.fileHandle)

  editorBox = editor.create(editorContainer.value, {
    value: content.value,
    language: getLanguageByHandle(props.fileHandle),
    theme: useDark().value ? 'darkTheme' : 'vs',
    foldingStrategy: 'indentation',
    selectOnLineNumbers: true, // 显示行号
    roundedSelection: false,
    readOnly: false, // 只读
    cursorStyle: 'line', // 光标样式
    automaticLayout: true, // 自动布局
    glyphMargin: false, // 字形边缘
    fontSize: 15, // 字体大小
    // minimap: {
    //   enabled: false,
    // },
    // scrollBeyondLastLine: false, // 取消代码后面一大段空白
    // overviewRulerBorder: false, // 不要滚动条的边框
  })
}

const getLanguageByHandle = (fileHandle: FileSystemFileHandle) => {
  const { name } = fileHandle
  if (/\.json$/i.test(name)) return 'json'
  if (/\.js|ts$/i.test(name)) return 'javascript'
  if (/\.ts$/i.test(name)) return 'typescript'
  if (/\.html|handlebars|razor$/i.test(name)) return 'html'
  if (/\.css|scss|less$/i.test(name)) return 'css'
  if (/\.bin$/i.test(name)) return 'shell'
  return ''
}

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
    <div class="flex mb-2 items-center justify-between">
      <code class="font-bold">{{ props.fileHandle?.name || '' }}</code>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <div ref="editorContainer" class="flex flex-1 h-0" />
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
