import type { PyodideInterface } from 'pyodide'
import 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'

interface Options {
  stdout?: (msg: string) => void;
  stderr?: (msg: string) => void;
}
export const usePyodide = (options?: Options) => {
  const loading = ref(false)
  const pyodide = shallowRef<PyodideInterface>()

  const loadPy = async () => {
    loading.value = true
    pyodide.value = await window.loadPyodide({
      stdout: (msg: string) => {
        options?.stdout?.(msg)
      },
      stderr: (msg) => {
        options?.stderr?.(msg)
      },
    }).finally(() => {
      loading.value = false
    })
  }

  const runPythonAsync = (code: string, o?: {
		globals?: any;
		locals?: any;
		filename?: string;
	}) => {
    if (!pyodide.value) throw new Error('Pyodide is not loaded')
    return pyodide.value.runPythonAsync(code, o).catch(err => {
      options?.stderr?.(err)
      throw err
    })
  }
  if (!pyodide.value && !loading.value) {
    loadPy()
  }
  return { loading, pyodide, runPythonAsync }
}
