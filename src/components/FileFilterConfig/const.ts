import { IConfig } from './index.d'

export const DEFAULT_CONFIG: IConfig = {
  fileSize: {
    enable: true,
    min: 0,
    max: 1024
  },
  fileType: {
    enable: true,
    types: []
  },
  entryType: {
    enable: true,
    types: []
  },
  mtime: {
    enable: true,
    range: []
  }
}

export const TYPES = [
  { label: '文件', value: 'file' },
  { label: '文件夹', value: 'folder' },
]
export const FILE_TYPES = [
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '文本', value: 'txt' },
]
export const SHORTCUTS = [
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      return [start, end]
    },
  },
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
]
