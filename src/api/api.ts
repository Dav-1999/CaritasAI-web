// 封装网络请求相关

import type { Article, Subject, SubProblem } from '@/types/subject'
import { createFetch } from '@vueuse/core'

export const clientFetch = createFetch({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
})

export const getArticle = async (id: number) => {
  const { data } = await clientFetch<ResponseData<Article>>(
    `/article/getArticleById?id=${id}`,
  )
    .get()
    .json()
  return data.value.data
}

export const getRelationCount = async () => {
  const { data } = await clientFetch<ResponseData<number>>(
    '/subjectSubProblemArticle/getSubjectSubProblemArticleListCount',
  )
    .get()
    .json()
  return data.value.data
}

export const getRelationList = async (
  pageNum: number = 0,
  pageSize: number = 10,
  subjectId: number = -1,
  subproblemId: number = -1,
) => {
  let suffix = ''
  if (subjectId != -1) {
    suffix += `&subjectId=${subjectId}`
  }
  if (subproblemId != -1) {
    suffix += `&subproblemId=${subproblemId}`
  }
  const { data } = await useFetch<ResponseData>(
    `https://api.xqher.cn/subjectSubProblemArticle/getSubjectSubProblemArticleList?pageNum=${pageNum}&pageSize=${pageSize}${suffix}`,
  )
    .get()
    .json()
  return data.value.data
}

export const getSubjectList = async () => {
  const { data } = await clientFetch<ResponseData<Subject>>(
    '/subject/getSubjectList',
  )
    .get()
    .json()
  return data.value.data
}

export const getSubProblemList = async (subjectId: number) => {
  const { data } = await clientFetch<ResponseData<SubProblem>>(
    `/subProblem/getSubProblemListBySubjectId?subjectId=${subjectId}`,
  )
    .get()
    .json()
  return data.value.data
}
