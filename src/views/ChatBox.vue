<template>
  <div class="chat-box">
    <ChatShow  :history="history"/>
    <ChatSend :chatType="chatType"/>
  </div>
</template>

<script lang="ts" setup name="ChatBox">
import ChatSend from '../components/ChatSend.vue';
import ChatShow from '../components/ChatShow.vue';
import {useRoute} from 'vue-router';
import { useHistoryStore } from '@/stores/history';
// import {ref} from 'vue'
// import { watch,reactive} from 'vue';
// import type { Message } from '@/type/Meessage';

//数据
const route = useRoute();

// const messages = reactive<Message[]>([]);
const history = useHistoryStore().getHistoryById(route.params?Number(route.params.historyId):0);
const chatType = history.messages.length>0;

//监听
// watch(
//       () => route.query, // 监听 params 对象
//       (value) => {
//         history = useHistoryStore().getHistoryById(value?Number(value.historyId):0)
//         console.log("history:",history)
//         // Object.assign(history!,history_copy)
//       },
//       {
//         immediate: true, // 立即执行一次，以便组件初始化时也获取数据
//         deep: true // 深度监听，以便检测到 params 对象中的属性变化
//       }
//     );
</script>

<style scoped>
.chat-box {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  width:calc(100% - 150px);;
  overflow: hidden;
  align-items: center;
  padding-bottom: 40px;
}
</style>
