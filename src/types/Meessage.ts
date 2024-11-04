import type {Retrieval} from './Retrieval'
export interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string | Retrieval;
  isShowOptions:boolean;
  isDigress?:boolean;
  updateContent?:string;
  contentType: 'text' | 'json';
  isRequestOver:boolean;
}
