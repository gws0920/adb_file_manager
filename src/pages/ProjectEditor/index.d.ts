export type DirectoryNode = {
  handle: FileSystemDirectoryHandle
  children?: ProjectTreeData[]
  isOpened?: boolean
  isLoading?: boolean
}

export type FileNode = {
  handle: FileSystemFileHandle
}

export type ProjectTreeData = FileNode | DirectoryNode
