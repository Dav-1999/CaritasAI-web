import axios from 'axios'
import  { type Message } from '@/types/Meessage';
export default async function(messages:Message[]){
  const url = import.meta.env.VITE_APP_BASE_BAIZE_URL+"/zhiPuAi/getSemanticRetrieval?question="+messages.slice(0,messages.length-1)[messages.slice(0,messages.length-1).length-1].text;
 return await axios.get(url,).then((value)=>{
  messages[messages.length-1].text += JSON.stringify(value.data);
})

}
