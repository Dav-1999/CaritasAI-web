import axios from 'axios'
import  { type Message } from '@/types/Meessage';
import emitter from '@/utils/emitter';
// import  { type Retrieval } from '@/types/Retrieval';
export default async function(messages:Message[]){
  const url = import.meta.env.VITE_APP_BASE_BAIZE_URL+"/zhiPuAi/invoke";
 return await axios.post(url,messages.slice(messages.length-2,messages.length-1)).then((value)=>{
  emitter.emit('stop-progress');
  messages[messages.length-1].contentType = value.data.data.type
  messages[messages.length-1].isDigress = value.data.data.isDigress
  messages[messages.length-1].updateContent = value.data.data.updateContent
  messages[messages.length-1].isRequestOver = true
  messages[messages.length-1].isShowOptions = value.data.data.isDigress
  if(value.data.data.type=="json"){
  messages[messages.length-1].content = {
    preface:`为您查询到关于“${messages[messages.length-2].content}”的文章`,
    content:value.data.data.data
  };
  } else {
    messages[messages.length-1].content = value.data.data.data;
  }
  console.log("messages[messages.length-1]",messages[messages.length-1])
})
}
