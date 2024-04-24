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

/**
 * 删除文件或文件夹
 * 浏览器已经实现handle.remove()方法，但是MDN文档中没有说明，且ts也没有响应的声明。所以这里实现一个兼容性方法
 * https://developer.chrome.com/docs/capabilities/web-apis/file-system-access?hl=zh-cn#deleting_a_file_or_folder_directly
 * @param handle 要删除的句柄
 * @param parent 父级文件夹句柄
 * @returns void
 */
export function deleteHandle (handle: FileSystemDirectoryHandle | FileSystemFileHandle, parent: FileSystemDirectoryHandle) {
  return parent.removeEntry(handle.name, { recursive: handle instanceof FileSystemDirectoryHandle })
}

/**
 * 重命名文件或文件夹
 * 浏览器已经实现handle.move()方法，但是MDN文档中没有说明，且ts也没有响应的声明。
 * https://developer.chrome.com/docs/capabilities/web-apis/file-system-access?hl=zh-cn#renaming_and_moving_files_and_folders
 * @param handle 重命名的句柄
 * @param newName 新名字
 * @param parent 父级句柄
 * @returns void
 */
export function renameHandle (/* handle: FileSystemDirectoryHandle | FileSystemFileHandle, newName: string, parent: FileSystemDirectoryHandle */) {
  throw '尚未实现'
}
