import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/utils/monacoEditorWorker'
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
