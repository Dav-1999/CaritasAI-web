import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { resolve } from 'path'
const pathSrc = resolve(__dirname, 'src')

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    // 用于本地代理转发，使 host:port/api/xxx 转发到 target/xxx
    server: {
      host: '0.0.0.0',
      // 使用 + 号将字符串转为数字
      port: +env.VITE_APP_PROT,
      open: true,
      proxy: {
        // 代理前缀为 /api 的请求
        [env.VITE_APP_BASE_PRFIX]: {
          changeOrigin: true,
          // 代理目标真实接口地址：https://api.caritas.pro
          target: env.VITE_APP_API_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_BASE_PRFIX), ""),
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        // 指定需要自动导入的库
        imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
        // 指定自动生成的依赖文件输出路径
        dts: resolve(pathSrc, 'types', 'auto-imports.d.ts'),
        // 自定义扫描路径添加需要的组件
        dirs: [resolve(pathSrc, 'stores'), resolve(pathSrc, 'api')],
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
  }
})
