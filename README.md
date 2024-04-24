# Mini Tools
在线文件编辑器、ADB管理工具
## 预览
[Github Page](https://gws0920.github.io/adb_file_manager/)

## 已实现功能
### 参数调试
基于File System API 在线编辑本地项目
1. 选择文件/文件夹时，保存句柄，下次启动时自动打开
    >  [File System API](https://developer.mozilla.org/zh-CN/docs/Web/API/File_System_API)
    >
    > 基于 FileSystemHandle 的对象能够被序列化存储至 IndexedDB 数据库实例中，也可以通过 postMessage() 移交
2. 选择根目录，递归列出所有文件夹及文件(递归组件/懒加载)
3. 文件/文件夹删除
4. 文件编辑保存

### ADB管理
在线Android手机文件上传、下载、删除以及ADB命令执行
#### 文件管理
1. 列出手机文件
2. （批量）上传文件到手机中
3. （批量）下载手机文件到本地
4. （批量）删除手机文件
5. 文件/文件夹快速选择
#### ADB Runner
1. 可执行ADB shell 命令

### TODO:
- [ ] 找个好看的UI做参考. `vscode`?
- [ ] 通过拖拽的方式选择根目录
- [ ] 文件/文件夹重命名
- [ ] 文件/文件夹创建
- [ ] 文件/文件夹搜索
- [ ] 文件/文件夹拖拽移动
- [ ] 快捷键
- [ ] 全局搜索(WebWorker)