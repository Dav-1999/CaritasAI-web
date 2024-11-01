import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { resolve } from 'path'
const pathSrc = resolve(__dirname, 'src')

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 指定需要自动导入的库
      imports: ['vue', 'pinia', 'vue-router'],
      // 指定自动生成的依赖文件输出路径
      dts: resolve(pathSrc, 'types', 'auto-imports.d.ts'),
      // 自定义扫描路径添加需要的组件
      dirs: [resolve(pathSrc, 'stores')],
    }),
    Components({
      dts: resolve(pathSrc, 'types', 'components.d.ts'),
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(pathSrc, 'assets', 'icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],

  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
})
