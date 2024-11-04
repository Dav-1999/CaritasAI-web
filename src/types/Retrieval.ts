interface RetrievalContent{
  body:object
  distance:number
  title:string
  url:string
}

export interface Retrieval{
preface:string
content: RetrievalContent[]
}

