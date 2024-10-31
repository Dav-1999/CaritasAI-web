# 开发记录

## 初始化项目

1. 添加日志文件
2. 初始化 vue 项目

```bash
# 使用 TS,
# 启用 Router、Pinia（页面跳转和状态管理功能支持）
# 引入ESLint、Prettier（校验和格式化代码）
npm create vue@latest
npm install
npm format
npm run dev
```

3. 修改配置

> [.gitignore](./.gitignore)中添加 vscode 的 history 文件夹，避免上传冗余的历史文件

```bash
# .gitignore
# Editor directories and files
# ……
.history
```

4. 删除项目初始冗余的组件和代码
5. 引入外部依赖

- 按需自动引入依赖插件

> 避免在多个页面重复引入 API 或 组件

```bash
npm install -D unplugin-auto-import unplugin-vue-components
```

新建`/src/types`用于存放自动生成的导入函数、组件、TS类型文件和后续的类型声明文件

配置[vite.config.ts](./vite.config.ts)设置插件按需引入

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { resolve } from 'path'
const pathSrc = resolve(__dirname, 'src')

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
  ],

  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
})
```

执行`npm run dev`生成依赖声明文件，测试将原有的引用声明删除。

## 部署参考

- [Vue3.3 + Vite+ Element-Plus + TypeScript 从0到1搭建企业级后台管理系统（前后端开源）](https://juejin.cn/post/7228990409909108793)
