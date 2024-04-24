import { ProjectTreeData, DirectoryNode } from './index.d'

/**
 * 获取文件夹下的所有文件及文件夹
 * @param node 文件夹节点
 * @returns 文件夹下的所有文件及文件夹 ProjectTreeData[]
 */
export const getNodeChildren = async (node: DirectoryNode) => {
  const children: ProjectTreeData[] = []
  for await (const value of node.handle.values()) {
    const relativePath = node.relativePath + '/' + value.name
    if (value.kind === 'directory') {
      children.unshift({
        handle: value,
        isOpened: false,
        isLoading: false,
        parent: node,
        relativePath
      })
    } else {
      children.push({ handle: value, parent: node, relativePath })
    }
  }
  return children
}

/**
 * 打开目标文件句柄的所有父级目录
 * @param node 根目录节点
 * @param target 目标文件句柄
 */
export const openParentByTarget = async (node: DirectoryNode, target: FileSystemFileHandle, relativePath: string) => {
  const fileHandleInNode = await getFileHandleByPath(node.handle, relativePath)
  const isSame = await fileHandleInNode.isSameEntry(target)
  if (!isSame) return node // target 不是root下面的文件

  const arr = relativePath.split('/').filter(Boolean)
  let currentNode = node
  for (let i = 0; i < arr.length; i++) {
    currentNode.isOpened = true
    currentNode.children = await getNodeChildren(currentNode)
    const nextNode = currentNode.children.find(item => item.handle.name === arr[i])
    if (!nextNode) return node
    currentNode = nextNode as DirectoryNode
  }
  return node
}
