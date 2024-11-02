export interface Article {
  id: number
  title: string | null
  question: string | null
  zhihuLink: string | null
  author: string | null
  lastUpdate: string | null
  createTime: string | null
  links: string[] | null
  tags: string[] | null
  content: string | null
  voteupCount: number | null
  commentCount: number | null
  thanksCount: number | null
  readCount: number | null
  favoritesCount: number | null
}

export interface SubProblem {
  id: number
  subjectId: number
  description: string | null
  name: string | null
  articleCount: number
}

export interface Subject {
  id: number
  name: string | null
  subProblemCount: number
  subProblemList: SubProblem[]
}

// subject & subProblem & article relation
export interface SSPA_Relation {
  subjectIds: string | null
  articleTitle: string | null
  subProblemIds: string | null
  articleId: number
}
