import { type Message } from "./Meessage";

export interface History {
  id: number;
  content: string;
  createTime: number;
  messages:Array<Message>;
  count: number;
  state: number;
}
