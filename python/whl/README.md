# 构建自定义的.whl

## setup
```shell
pip install setuptools wheel
python setup.py bdist_wheel
```
完成后`/python/dist`会生成相应的`.whl`文件

## 测试`.whl`
```shell
pip install .\dist\test_pkg-0.4-py3-none-any.whl
python
```
```py
import test_pkg
test_pkg.test2() # 输出 hello world
```

## 在JavaScript中调用
```js
const run = async () => {
  // 初始化pyodide
  pyodide.value = await window.loadPyodide()

  // 加载.whl
  const whlPath = new URL('/public/test_pkg-0.4-py3-none-any.whl', import.meta.url).href
  const buffer = await fetch(whlPath).then(res => res.arrayBuffer()) // .zip, .whl, ...
  await pyodide.value.loadPackage(['opencv-python']) // test_pkg依赖opencv-python
  await pyodide.value.unpackArchive(buffer, 'wheel')
  const pkg = await pyodide.value.pyimport('test_pkg')

  const blob = new Blob([]) // 省略，这里是一个图片的blob
  const base64 = await blob2base64(sourceBlob.value)

  // 调用get_gray_image
  const res = pkg.get_gray_image(base64.replace('data:image/jpeg;base64,', ''))
  const result = `data:image/jpeg;base64,${res}` // 这里时灰度图的base64
}
```