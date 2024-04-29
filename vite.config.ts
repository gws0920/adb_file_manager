import { defineConfig } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusResolve, createStyleImportPlugin } from 'vite-plugin-style-import'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
      dirs: [
        'src/utils',
        'src/store',
      ],
      eslintrc: {
        enabled: true,
      }
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name: string) => {
            if (/^el/.test(name)) {
              return `element-plus/theme-chalk/${name}.css`
            }
          },
        },
        {
          libraryName: 'vxe-table',
          esModule: true,
        }
      ]
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      },
    ]
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        sanitizeFileName (name: any) {
          const match = DRIVE_LETTER_REGEX.exec(name)
          const driveLetter = match ? match[0] : ''
          // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
          // Otherwise, avoid them because they can refer to NTFS alternate data streams.
          return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
        },
      }
    },
    assetsInlineLimit: 1024 * 1024 * 1
  },
  base: './',
  optimizeDeps: {
    include: []
  },
  assetsInclude: ['**/*.jpg'],
})
