export * from './fileSystem'
export * from './indexedDB'
export * from './EVENT_BUS_KEYS'
export * from './adbDevice'
export * from './pyRunner'
export const minmax = (val: number, [min, max]: number[]) => Math.max(Math.min(val, max), min)

export function formatFileSize (size: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(3)}${units[i]}`
}

export function isImg (name: string) {
  return /\.(png|jpg|jpeg|webp)$/.test(name)
}
