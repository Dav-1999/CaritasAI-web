// 封装网络请求相关

import { createFetch } from '@vueuse/core'

export const clientFetch = createFetch({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
})
