<template>
  <div class="messages" ref="messagesRef">
    <div v-for="message in history.messages" :key="message.id">
      <ChatMessage :message="message" />
    </div>
  </div>
</template>

<script lang='ts' setup name="ChatShow">
import type { Message } from '@/types/Meessage';
import { ref, onUnmounted, onMounted,onUpdated, defineProps } from 'vue'
import emitter from '@/utils/emitter';
import ChatMessage from './ChatMessage.vue';
// import UseZhipuAi from '@/hooks/UseZhiPuAi'
import UseSemanticRetrieval from '@/hooks/UseSemanticRetrieval';
// import UseZhipuAiServer from '@/hooks/UseZhiPuAiServer'
import { useHistoryStore } from '@/stores/history';
import { useRouter } from 'vue-router';
//数据
const messagesRef = ref<HTMLDivElement | null>(null);
const { history } = defineProps(["history"]);
const router = useRouter();
//方法
function getAIResponse() {
  // eslint-disable-next-line vue/no-mutating-props
  history.messages.push({ id: Date.now(), sender: 'ai', content: '' ,isShowOptions:false,contentType:"text",isRequestOver:false});
  setTimeout(() => {
    emitter.emit('start-progress');
    setTimeout(() => {
  UseSemanticRetrieval(history.messages).then(() => {
    if (history.state === 0) {
      Object.assign(history, useHistoryStore().addHistory(history))
        // eslint-disable-next-line vue/no-mutating-props
        // console.log("存入缓存：",toRaw(useHistoryStore().$state.historyList))
        localStorage.setItem('historyList', JSON.stringify(useHistoryStore().$state.historyList));
        // console.log("当前缓存",localStorage.getItem('historyList')!)
        router.replace({
        name: 'chatBox',
        params: {
          historyId: history.id
        }
      })
    } else {
        // eslint-disable-next-line vue/no-mutating-props
        // console.log("存入缓存：",useHistoryStore().$state.historyList);
        localStorage.setItem('historyList', JSON.stringify(useHistoryStore().$state.historyList));
        // console.log("当前缓存",localStorage.getItem('historyList')!);
    }
  })
  scrollToBottom();}, 3000)
}, 500);
};

function scrollToBottom() {
  requestAnimationFrame(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTo({
        top: messagesRef.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
};

onUpdated(()=>{

  })
onMounted(() => {
  emitter.on("send-message", (value:unknown) => {
    // eslint-disable-next-line vue/no-mutating-props
    history.messages.push(value as Message);
    scrollToBottom();
    getAIResponse();
  })

  emitter.on("show-scroll-bottom", () => {
    scrollToBottom();
  })
  scrollToBottom();
});

//解绑事件
onUnmounted(() => {
  emitter.off("send-message");
  emitter.off("show-scroll-bottom");
  localStorage.setItem('historyList', JSON.stringify(useHistoryStore().$state.historyList));
})


</script>

<style scoped>
.messages {
  flex-grow: 1;
  overflow-y: auto;
  width: calc(50% - 40px);
  padding: 20px;
}

/* WebKit 内核浏览器样式 */
.messages::-webkit-scrollbar {
  display: none;
}

/* Firefox 浏览器样式 */
.messages::-moz-scrollbar {
  display: none;
}

/* IE/Edge 浏览器样式 */
.messages::-ms-scrollbar {
  display: none;
}
</style>
