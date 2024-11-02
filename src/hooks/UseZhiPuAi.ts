import type { Message } from "@/types/Meessage";

// import axios from 'axios'
export default async function(text:string,message:Message): Promise<Message> {
  // 请替换为你的智普AI API Key
const apiKey = "6d673210d3fde35768998da69feca1b1.OUOnpekWvmwP5tLL";
// 请替换为你要调用的模型名称
const model = "glm-4";

// 智普的接口
const url = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const messages = [
  { "role": "system", "content": "你是一个乐于回答各种问题的小助手，你的任务是提供专业、准确、有洞察力的建议。" },
  { "role": "user", "content": text }
];

const data = {
  "model":model,
  "messages":messages,
  "stream":true
}
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${apiKey}`
};


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
return new Promise<Message>(resolve => {fetch(url, {
  method: 'POST', // 或者 'POST'，根据你的需求
  headers: headers,
  body:JSON.stringify(data)
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
            controller.close();
            resolve(message);
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
                  message.text += data.choices[0].delta.content;
                  console.log(data.choices[0].delta.content); // 处理每个JSON对象
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
