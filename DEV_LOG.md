# 开发记录

## 初始化项目

### 项目基本配置

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

### 按需自动引入依赖插件

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

### 引入 SVG 图标支持

```bash
# 安装 latest 避免废弃警告，使用 npm outdated 查看可以更新的包
# 使用 npm audit fix 可尝试自动修复有问题的依赖
npm install -D fast-glob@latest
npm install -D vite-plugin-svg-icons@2.0.1
```

创建 `src/assets/icons`目录，放入[iconfont](https://www.iconfont.cn)中下载的 svg 图标

在[main.ts](./src/main.ts)中引入注册脚本

```typescript
// src/main.ts
import 'virtual:svg-icons-register'
```

配置[vite.config.ts](./vite.config.ts)插件

```typescript
import { resolve } from 'path'
const pathSrc = resolve(__dirname, 'src')

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(pathSrc, 'assets', 'icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
})
```

封装 [SVG组件](./src/components/SvgIcon.vue)

使用例

```html
<!-- 会受容器的color属性影响，注意下载的svg文件内不应有内联的fill属性导致无法设置颜色 -->
<button @click="add"><svg-icon icon-class="sailboat" />increase</button>
<svg-icon icon-class="up" color="tomato" />
```

### 修改样式文件位置，修改默认 css

将`assets`下的css放于项目`src/styles`下，修改[main.ts](./src/main.ts)中的引入路径。

```typescript
// src/main.ts
import './styles/main.css'
```

> 后续需要兼容移动端可考虑[material-web组件](https://github.com/material-components/material-web?tab=readme-ov-file#material-web)


### 添加环境变量配置和本地请求转发

根目录新建 `.env.production` 和 `.env.development`两个配置文件

编写环境变量并在代码中测试使用

> `npm run bulid`中打开的页面和`npm run dev`打开的页面应观察到使用的变量值不同

```yaml
# .env.development
# 变量以VITE_开头才能被读取
VITE_APP_TITLE='开发环境'
VITE_APP_PROT=4200
VITE_APP_BASE_PRFIX='/api'
# 本地开发环境下请求地址，生产环境时替换为转发目标即可
VITE_APP_BASE_URL='http://localhost:4200/api'
# 转发目标
VITE_APP_API_URL='https://api.caritas.pro'
```

在[vite.config.ts](./vite.config.ts)中修改代码引入环境变量加载.env配置，并配置本地转发

> [vite相关配置说明](https://cn.vitejs.dev/config/#using-environment-variables-in-config)

```typescript
import { defineConfig, loadEnv } from 'vite'

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
    ……
  }});
```

使用测试

```vue
<script setup lang="ts">
const title = import.meta.env.VITE_APP_TITLE as string
// 测试本地服务器转发 https://api.caritas.pro/article/getTagsMap
const resp = ref('');

onMounted(async () => {
  await fetch(`${import.meta.env.VITE_APP_BASE_URL}/article/getTagsMap`).then(res => res.json()).then(res => {
    resp.value = res
    console.log(resp);

  })
})
</script>

<template>
  <h2>{{ title }}</h2>
  <main>
    <pre>
      {{ resp }}
    </pre>
  </main>
</template>
```

### 引入VueUse

> [VueUse](https://vueuse.pages.dev/guide/) 是基于组合 API的一系列实用函数集合。

当前主要用于简化 SSE 请求和虚拟列表实现等。

```bash
npm i @vueuse/core
```
安装后，在[vite.config.ts](./vite.config.ts)中添加自动引入，并新建[src/api/api.ts](./src/api/api.ts)用于后续管理网络请求相关抽象接口。

具体 useFetch 使用代码案例似乎不多，当前仅封装 baseUrl，后续可以封装一些请求方法，token传递等

> 此处 ResponseData 是全局类型声明中定义的[src/types/global.d.ts](./src/types/global.d.ts)

```typescript
const resp = ref<ResponseData>()
onMounted(async () => {
  const { data } = await clientFetch<ResponseData>('/subject/getSubjectList').get().json()
  resp.value = data.value
})
```

## 部署参考

- [Vue3.3 + Vite+ Element-Plus + TypeScript 从0到1搭建企业级后台管理系统（前后端开源）](https://juejin.cn/post/7228990409909108793)
