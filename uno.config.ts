import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
export default defineConfig({
  theme: {
    colors: {
      primary: '#409EFF',
      success: '#67C23A',
      warning: '#E6A23C',
      error: '#F56C6C',
      info: '#909399',
      border: '#DCDFE6',
    },
  },
  transformers: [
    transformerVariantGroup(),
    transformerDirectives()
  ],
  shortcuts: [
    {
      'border-base': 'border border-border border-solid rounded'
    }
  ]
})
