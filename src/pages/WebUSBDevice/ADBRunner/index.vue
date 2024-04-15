<script lang="ts" setup>
import { Adb, AdbSubprocessProtocol } from '@yume-chan/adb'
import { DecodeUtf8Stream, WritableStream } from '@yume-chan/stream-extra'
const getAdb = inject<() => null | Adb>('getAdb', () => null)

let process: AdbSubprocessProtocol | undefined
const log = ref('')
const command = ref('ls -l')
const running = ref(false)
const run = async () => {
  const adb = getAdb()
  process = await adb?.subprocess.shell(command.value)
  log.value = ''
  running.value = true
  const stream = new WritableStream<string>({
    write: (chunk) => {
      log.value += chunk
    },
    close: () => {
      running.value = false
    }
  })
  process?.stdout.pipeThrough(new DecodeUtf8Stream()).pipeTo(stream)
  process?.exit.then((e) => {
    console.log('退出了', e)
  })
  return process
}

const stopping = ref(false)
const stop = async () => {
  stopping.value = true
  const a = process?.kill()
  if (a instanceof Promise) {
    await a
  }
  stopping.value = false
}
</script>

<template>
  <div class="flex flex-col w-full pl-2 overflow-hidden">
    <div class="flex items-center">
      <el-input v-model="command" class="mr-2">
        <template #prepend>
          adb shell
        </template>
      </el-input>
      <el-button type="primary" :loading="running" @click="run">run</el-button>
      <el-button
        v-if="running"
        type="danger"
        :loading="stopping"
        @click="stop"
      >stop</el-button>
    </div>
    <code class="whitespace-pre overflow-auto">{{ log }}</code>
  </div>
</template>

<style lang="scss" scoped>

</style>
