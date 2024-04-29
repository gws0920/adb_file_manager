<script lang="ts" setup>
import { editor } from 'monaco-editor'
import dayjs from 'dayjs'

const { runPythonAsync } = usePyodide({
  stdout: (data) => {
    logs.push({ t: Date.now(), text: data, type: 'normal' })
  },
  stderr: (data) => {
    logs.push({ t: Date.now(), text: data, type: 'error' })
  }
})
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

const editorContainer = ref<HTMLDivElement>()

const initEditor = async () => {
  if (editorBox) {
    editorBox.dispose?.()
  }
  if (!editorContainer.value) return

  editorBox = editor.create(editorContainer.value, {
    value: 'print(1 + 2)\n1 + 1',
    language: 'python',
    theme: useDark().value ? 'darkTheme' : 'vs',
    foldingStrategy: 'indentation',
    selectOnLineNumbers: true, // 显示行号
    roundedSelection: false,
    readOnly: false, // 只读
    cursorStyle: 'line', // 光标样式
    automaticLayout: true, // 自动布局
    glyphMargin: false, // 字形边缘
    fontSize: 15, // 字体大小
  })
}

const logs = reactive<{t: number, text: string, type: 'error' | 'normal'}[]>([])
const running = ref(false)
const run = () => {
  logs.length = 0
  running.value = true
  const code = editorBox.getValue()
  runPythonAsync(code).then((res) => {
    if (!res) return
    logs.push({ t: Date.now(), text: res, type: 'normal' })
  }).finally(() => {
    running.value = false
  })
}
onMounted(async () => {
  initEditor()
})

</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="flex mb-2 items-center justify-end">
      <el-button
        type="primary"
        size="small"
        :loading="running"
        @click="run"
      >运行</el-button>
    </div>
    <div ref="editorContainer" class="flex flex-1 h-0" />
    <div v-if="logs.length" class="log">
      <h4>输出</h4>
      <ul>
        <li v-for="log, index in logs" :key="index" :class="log.type">
          <time :datetime="(new Date(log.t)).toJSON()">{{ dayjs(log.t).format('HH:mm:ss') }}</time>
          <code>{{ log.text }}</code>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.log {
  @apply mt-2 max-h-200px px-4;
  border-top: 1px solid var(--el-border-color);
  h4 {
    @apply my-2 text-base;
  }
  ul {
    @apply flex flex-col h-full overflow-auto;
    list-style: none;
    li {
      @apply flex items-start;
      color: var(--el-text-color-regular);

      &.error {
        color: var(--el-color-error);
      }
      time {
        @apply mr-2 opacity-80;
        font-size: 12px;
        line-height: 20px;
      }
      code {
        @apply text-sm overflow-auto whitespace-pre;
      }
    }
  }
}
</style>
