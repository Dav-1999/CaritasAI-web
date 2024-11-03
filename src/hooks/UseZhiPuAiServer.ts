import type { Message } from "@/types/Meessage";
import emitter from '../utils/emitter'

// import axios from 'axios'
export default async function (messages:Message[]) : Promise<Message[]>{
// 后端的接口
const url = import.meta.env.VITE_APP_BASE_BAIZE_URL+"/zhiPuAi/sseInvoke?prompt=";

/**
 * 使用axios返回所有数据
 */
// axios.post(url,data,{
//   headers:headers,
// }).then((value)=>{
//   console.log("智普返回的数据",value);
// })


/**
 * 使用fetch流式处理数据
 */
return new Promise<Message[]>(resolve => {fetch(url, {
  method: 'POST', // 或者 'POST'，根据你的需求
  headers: {
    'Content-Type': 'application/json', // 设置Content-Type为application/json
  },
  body:JSON.stringify(messages.slice(0,messages.length-1))
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  let dataBuffer = '';

  return new ReadableStream({
    start(controller) {
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            resolve(messages);
            controller.close();
            return;
          }
          dataBuffer += decoder.decode(value, { stream: true });
          const parts = dataBuffer.split('\n');
          dataBuffer = parts.pop()!; // 保留最后一个不完整的部分

          parts.forEach(part => {
            if (part.startsWith('data: ')) {
              const jsonStr = part.slice(6); // 移除 'data: ' 前缀
              if (jsonStr !== '[DONE]') {
                try {
                  const data = JSON.parse(jsonStr);
                  messages[messages.length-1].text += data.choices[0].delta.content;
                  emitter.emit("show-scroll-bottom");
                  // console.log(data.choices[0].delta.content); // 处理每个JSON对象
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                }
              } else {
                return;
              }
            }
          });
          read();
        }).catch(error => {
          console.error('Fetch error:', error);
          controller.error(error);
        });
      }
      read();
    }
  });
})
.catch(error => {
  console.error('Fetch error:', error);
})});

}
