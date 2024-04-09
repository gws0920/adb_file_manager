# Mini Tools
实验性小工具
## 预览
[Github Page](https://gws0920.github.io/MiniTools/)
## 文件编辑器
基于`File System APi`实现的文件编辑器。选择文件夹可在线修改文件夹内的文件。

### 已实现功能
1. 选择文件/文件夹时，保存句柄，下次启动时自动打开
    >  [File System API](https://developer.mozilla.org/zh-CN/docs/Web/API/File_System_API)
    >
    > 基于 FileSystemHandle 的对象能够被序列化存储至 IndexedDB 数据库实例中，也可以通过 postMessage() 移交
2. 选择根目录，递归列出所有文件夹及文件(递归组件/懒加载)

### TODO:
- [ ] 找个好看的UI做参考. `vscode`?
- [ ] 通过拖拽的方式选择根目录
- [ ] 文件/文件夹重命名
- [ ] 文件/文件夹删除
- [ ] 文件/文件夹创建
- [ ] 文件/文件夹搜索
- [ ] 文件/文件夹拖拽移动
- [ ] 基于已实现的【1】，添加判断：如果`IndexedDB`中存在的文件句柄不属于当前文件夹(`root`)句柄内，则删除该句柄
- [ ] 使用`monaco-editor` 实现文件编辑，而非简单的`textarea`
- [ ] 快捷键
- [ ] 文件搜索