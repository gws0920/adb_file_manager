import Dexie, { Table } from 'dexie'

type LasterFileHandleInfo = { type: 'file', handle: FileSystemFileHandle, relativePath: string }
type LasterDirectoryHandleInfo = { type: 'directory', handle: FileSystemDirectoryHandle, relativePath: string }

class AppDataBase extends Dexie {
  public LasterHandles!: Table<LasterFileHandleInfo | LasterDirectoryHandleInfo, string> // id is number in this case

  public constructor () {
    super('AppDataBase')
    this.version(1).stores({
      LasterHandles: 'type, handle, relativePath',
    })
  }
}

const db = new AppDataBase()

// 保存最后打开的目录
export function setLasterDirHandle (handle: FileSystemDirectoryHandle) {
  return db.LasterHandles.put({ handle, type: 'directory', relativePath: '' })
}
// 保存最后打开的文件
export function setLasterFileHandle (handle: FileSystemFileHandle, relativePath: string) {
  return db.LasterHandles.put({ handle, type: 'file', relativePath })
}

// 获取最后打开的目录
export const getLasterDirHandle = () => {
  return db.LasterHandles.get('directory').then(res => res?.handle as FileSystemDirectoryHandle | undefined)
}
// 获取最后打开的文件
export const getLasterFileHandle = () => {
  return db.LasterHandles.get('file').then(res => ({
    handle: res?.handle as FileSystemFileHandle | undefined,
    relativePath: res?.relativePath
  }))
}

// 清除LasterHandles表中全部数据
export const clearLasterHandles = () => {
  return db.LasterHandles.clear()
}
