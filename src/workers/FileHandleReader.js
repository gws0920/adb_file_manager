
self.onmessage = e => {
  const { handle, type = 'Text' } = e.data
  const fileReader = new FileReader()
  fileReader.onloadend = () => {
    self.postMessage(fileReader.result)
    self.close()
  }

  fileReader.onerror = err => {
    console.error('读取文件信息失败', err)
    self.postMessage('')
    self.close()
  }
  handle.getFile().then(file => fileReader[`readAs${type}`](file))
}
