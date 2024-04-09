/**
 * 根据文件相对路径获取文件句柄
 * @param root 根目录的文件夹句柄
 * @param path 文件相对于根目录的路径
 * @returns 文件句柄
 */
export const getFileHandleByPath = async (root: FileSystemDirectoryHandle, path: string) => {
  const pathParts = path.split(/\\|\//).filter(Boolean)
  const filename = pathParts.pop() || ''
  const dirHandle = await getDirectoryHandleByPath(root, pathParts.join('/'))
  return dirHandle.getFileHandle(filename)
}

/**
 * 根据文件夹相对路径获取文件夹句柄
 * @param root 根目录的文件夹句柄
 * @param path 文件夹相对于根目录的路径
 * @returns 文件夹句柄
 */
export const getDirectoryHandleByPath = async (root: FileSystemDirectoryHandle, path: string) => {
  const pathParts = path.split(/\\|\//).filter(Boolean)
  let handle: FileSystemDirectoryHandle = root
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i]
    handle = await handle.getDirectoryHandle(part)
  }
  return handle
}

export function getFileContentByHandle(file: FileSystemFileHandle, type?: 'Text'): Promise<string>
export function getFileContentByHandle(file: FileSystemFileHandle, type: 'ArrayBuffer'): Promise<ArrayBuffer>
export function getFileContentByHandle(file: FileSystemFileHandle, type: 'DataURL'): Promise<string>
/**
 * 通过文件句柄获取文件内容
 *
 * @param file 文件句柄
 * @param type 文件类型，可选值为 'Text' | 'DataURL' | 'ArrayBuffer'，默认为 'Text'
 * @returns 返回文件内容，根据 type 参数的不同，返回类型可能为 string | ArrayBuffer | null
 */
export function getFileContentByHandle (file: FileSystemFileHandle, type: 'Text' | 'DataURL' | 'ArrayBuffer' = 'Text') {
  const fileReader = new FileReader()
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    fileReader.onloadend = () => resolve(fileReader.result)
    fileReader.onerror = reject
    file.getFile().then(file => fileReader[`readAs${type}`](file))
  })
}
