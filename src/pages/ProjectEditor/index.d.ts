export type DirectoryNode = {
  handle: FileSystemDirectoryHandle
  parent?: DirectoryNode
  children?: ProjectTreeData[]
  isOpened?: boolean
  isLoading?: boolean
}

export type FileNode = {
  handle: FileSystemFileHandle
  parent: DirectoryNode
}

export type ProjectTreeData = FileNode | DirectoryNode
