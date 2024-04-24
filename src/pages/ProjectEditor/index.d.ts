export type DirectoryNode = {
  handle: FileSystemDirectoryHandle
  relativePath: string
  parent?: DirectoryNode
  children?: ProjectTreeData[]
  isOpened?: boolean
  isLoading?: boolean
}

export type FileNode = {
  handle: FileSystemFileHandle
  parent: DirectoryNode
  relativePath: string
}

export type ProjectTreeData = FileNode | DirectoryNode
