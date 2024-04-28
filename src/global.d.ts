import { loadPyodide, PyodideAPI } from 'pyodide'
declare global {
  interface Window {
    loadPyodide: typeof loadPyodide
    // loadPyodide: any
  }
}
