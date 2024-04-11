<script lang="ts" setup>
import { AdbDaemonWebUsbDeviceManager, ADB_DEFAULT_DEVICE_FILTER, AdbDaemonWebUsbDevice, AdbDaemonWebUsbConnection } from '@yume-chan/adb-daemon-webusb'
import { Adb, AdbDaemonTransport } from '@yume-chan/adb'
import AdbWebCredentialStore from '@yume-chan/adb-credential-web'
import { DecodeUtf8Stream, WritableStream } from '@yume-chan/stream-extra'
import DeviceMenu from './components/DeviceMenu/index.vue'
// 获取设备权限
const requestDevice = () => {
  const Manager = AdbDaemonWebUsbDeviceManager.BROWSER
  if (!Manager) return Promise.reject('不支持WebUsb')
  return Manager.requestDevice({
    // filters: [
    //   {
    //     ...ADB_DEFAULT_DEVICE_FILTER,
    //     vendorId: 0x18d1,
    //     productId: 0x4ee2,
    //   },
    // ]
  })
}

// 删除权限
// device.raw.forget()

const getDevice = () => {
  const Manager = AdbDaemonWebUsbDeviceManager.BROWSER
  if (!Manager) return Promise.reject('不支持WebUsb')
  return Manager.getDevices()
}

const run = async () => {
  const device = await getDevice() || await requestDevice()
  if (!device) return
  const connection = await device.connect()
  const credentialStore = new AdbWebCredentialStore()
  const transport = await AdbDaemonTransport.authenticate({
    serial: device.serial,
    connection,
    credentialStore
  })
  const adb = new Adb(transport)
  const process = await adb.subprocess.spawn('ls -l')

  console.log(process)

  let res = ''
  const stream = new WritableStream<string>({
    write: (chunk) => {
      res += chunk
    },
  })
  window.d = device
  await process.stdout.pipeThrough(new DecodeUtf8Stream()).pipeTo(stream)
  console.log(res)
}

const router = useRouter()
const goBack = () => {
  router.push('/')
}

let adb: Adb | null = null
const deviceInfo = reactive({ name: '', serial: '' })
const initDevice = async (device: AdbDaemonWebUsbDevice) => {
  if (device.raw.opened) return ElMessage.info('设备已连接')
  if (adb) {
    adb.close?.()
  }
  deviceInfo.name = device.name
  deviceInfo.serial = device.serial
  const connection = await device.connect()
  const credentialStore = new AdbWebCredentialStore()
  const transport = await AdbDaemonTransport.authenticate({
    serial: device.serial,
    connection,
    credentialStore
  })
  adb = new Adb(transport)
}

const loading = ref(false)
const chooseDevice = async () => {
  const device = await requestDevice()
  if (!device) return
  loading.value = true
  await initDevice(device).finally(() => {
    loading.value = false
  })
}

onMounted(async () => {
  const device = await getDevice()
  if (!device?.[0]) return
  await initDevice(device[0])
})
</script>

<template>
  <div class="flex flex-col h-full w-full p-2 overflow-hidden">
    <div class="flex items-center">
      <el-page-header @back="goBack">
        <template #title>
          <span style="color: var(--el-text-color-regular)">
            返回首页
          </span>
        </template>
        <template #content>
          <code class="font-600 text-large mr-3">{{ deviceInfo.name || '未连接设备' }}</code>
          <el-button
            type="primary"
            :loading="loading"
            text
            @click="chooseDevice"
          >选择设备</el-button>
        </template>
      </el-page-header>
    </div>
    <el-divider class="!mt-4 !mb-1" />
    <div class="flex flex-1 h-0 my-2 overflow-hidden">
      <DeviceMenu />
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
