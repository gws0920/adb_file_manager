import { AdbSync } from '@yume-chan/adb'
import {
  InspectStream,
  Consumable,
  WrapConsumableStream,
  WrapReadableStream,
  ReadableStream,
} from '@yume-chan/stream-extra'

/**
 * 将手机文件保存到电脑本地
 * @param sync AdbSync
 * @param filepath 文件路径
 * @param dirHandle 文件保存路径
 * @returns Promise<void>
 */
export const downloadDeviceFile = async (sync: AdbSync, filepath: string, dirHandle: FileSystemDirectoryHandle) => {
  const content = sync.read(filepath)
  const filename = filepath.split(/\\|\//).pop() || 'name'
  const fileHandle = await dirHandle.getFileHandle(filename, { create: true })
  const writableFileStream = await fileHandle?.createWritable()
  return content.pipeTo(writableFileStream as any)
}

/**
 * 将手机文件夹保存到电脑本地
 * @param sync AdbSync
 * @param dirPath 文件夹路径
 * @param dirHandle 文件夹保存路径
 * @returns Promise<void>
 */
export const downloadDeviceDir = async (sync: AdbSync, dirPath: string, dirHandle: FileSystemDirectoryHandle, onProgress?: (str: string) => void) => {
  const dirName = dirPath.split(/\\|\//).pop() || 'dir'
  dirHandle = await dirHandle.getDirectoryHandle(dirName, { create: true })
  const list = await sync.readdir(dirPath)
  for (let i = 0; i < list.length; i++) {
    const { name } = list[i]
    const isDirectory = await sync.isDirectory(`${dirPath}/${name}`)
    if (isDirectory) {
      const handle = await dirHandle.getDirectoryHandle(name, { create: true })
      await downloadDeviceDir(sync, `${dirPath}/${name}`, handle, onProgress)
    } else {
      onProgress && onProgress(name)
      await downloadDeviceFile(sync, `${dirPath}/${name}`, dirHandle)
    }
  }
}

/**
 * 将本地文件上传到手机中
 * @param sync AdbSync
 * @param path 文件保存到手机的哪个路径
 * @param fileHandle 要上传的文件句柄
 *
 * eg: uploadFileToDevice(sync, '/storage/emulated/0/test.txt', fileHandle)
 */
export const uploadFileToDevice = async (sync: AdbSync, path: string, file: File, onProgress?: (v: number) => void) => {
  const stream = new WrapReadableStream<Uint8Array>(file.stream() as unknown as ReadableStream<Uint8Array>)
    .pipeThrough(new WrapConsumableStream())
    .pipeThrough(
      new ProgressStream((v) => {
        onProgress && onProgress(+((v / file.size) * 100))
      })
    )
  return sync.write({ filename: path, file: stream, mtime: file.lastModified })
}

export class ProgressStream extends InspectStream<Consumable<Uint8Array>> {
  public constructor (onProgress: (value: number) => void) {
    let progress = 0
    super((chunk) => {
      progress += chunk.value.byteLength
      onProgress(progress)
    })
  }
}
