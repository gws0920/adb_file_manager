
// @ts-nocheck
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const isDev = process.env.NODE_ENV === 'development'

self.MonacoEnvironment = {
  getWorker: function (_, label) {
    const getWorkerModule = (moduleUrl: string, label: string) => {
      return new Worker(new URL('/node_modules/monaco-editor/esm/vs/' + moduleUrl + '.js?worker', import.meta.url), {
        name: label,
        type: 'module'
      })
    }
    if (label === 'json') {
      return isDev ? new JsonWorker() : getWorkerModule('language/json/json.worker', label)
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return isDev ? new CssWorker() : getWorkerModule('language/css/css.worker', label)
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return isDev ? new HtmlWorker() : getWorkerModule('language/html/html.worker', label)
    }
    if (label === 'typescript' || label === 'javascript') {
      return isDev ? new TsWorker() : getWorkerModule('language/typescript/ts.worker', label)
    }
    return isDev ? new EditorWorker() : getWorkerModule('editor/editor.worker', label)
  }
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
