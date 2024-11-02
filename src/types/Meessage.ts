export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  endTheOutput:boolean;
}
