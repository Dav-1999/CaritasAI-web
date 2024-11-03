// 封装网络请求相关

import type { Article } from '@/types/subject'
import { createFetch } from '@vueuse/core'

export const clientFetch = createFetch({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
})

export const getArticle = async (id: number) => {
  const { data } = await clientFetch<ResponseData<Article>>(`/article/getArticleById?id=${id}`).get().json()
  return data.value
}

export const getRelationCount = async () => {
  const { data } = await clientFetch<ResponseData<number>>('/subjectSubProblemArticle/getSubjectSubProblemArticleListCount').get().json()
  return data.value.data
}

export const getRelationList = async (pageNum: number = 0, pageSize: number = 10) => {
  const { data } = await clientFetch<ResponseData>(`/subjectSubProblemArticle/getSubjectSubProblemArticleList?pageNum=${pageNum}&pageSize=${pageSize}`).get().json()
  return data.value.data
}

