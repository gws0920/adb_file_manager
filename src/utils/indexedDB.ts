import Dexie, { Table } from 'dexie'

type LasterFileHandleInfo = { type: 'file', handle: FileSystemFileHandle }
type LasterDirectoryHandleInfo = { type: 'directory', handle: FileSystemDirectoryHandle }

class AppDataBase extends Dexie {
  public LasterHandles!: Table<LasterFileHandleInfo | LasterDirectoryHandleInfo, string> // id is number in this case

  public constructor () {
    super('AppDataBase')
    this.version(1).stores({
      LasterHandles: 'type, handle',
    })
  }
}

const db = new AppDataBase()

// 保存最后打开的目录
export function setLasterDirHandle (handle: FileSystemDirectoryHandle) {
  return db.LasterHandles.put({ handle, type: 'directory' })
}
// 保存最后打开的文件
export function setLasterFileHandle (handle: FileSystemFileHandle) {
  return db.LasterHandles.put({ handle, type: 'file' })
}

// 获取最后打开的目录
export const getLasterDirHandle = () => {
  return db.LasterHandles.get('directory').then(res => res?.handle as FileSystemDirectoryHandle | undefined)
}
// 获取最后打开的文件
export const getLasterFileHandle = () => {
  return db.LasterHandles.get('file').then(res => res?.handle as FileSystemFileHandle | undefined)
}

// 清除LasterHandles表中全部数据
export const clearLasterHandles = () => {
  return db.LasterHandles.clear()
}
