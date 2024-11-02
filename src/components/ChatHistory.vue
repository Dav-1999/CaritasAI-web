<template>
   <!-- <Tooltip content="已切换新对话" :isVisible="isVisible" :is-sliding-out="isSlidingOut"/> -->
  <div class="chat-history">
      <button @click = "newChat($route.params.historyId)" class="new-chat">新建对话</button>
    <div class="chat-history-list" chatHistory><RouterLink :class="{ 'active-router-link': $route.path === '/chat/chatBox/'+history.id && $route.params.historyId === history.id.toString() }" class="router-link"  replace :to="{
      name: 'chatBox',
      params: {
        historyId: history.id
      }
    }" v-for="history in historyList" :key="history.id">
      <div class="content-box">
        <div class="content">{{ history.content }}</div>
        <div class="subContent">{{ getDateTime(history.createTime) }}</div>
      </div>
    </RouterLink>
    </div>
  </div>
</template>

<script lang='ts' setup name="ChatHistory">
import { RouterLink } from 'vue-router';
import { useHistoryStore } from '@/stores/history';
import { type History } from '../types/History'
import { getDateTime } from '@/utils/dateTime';
import { useRouter } from 'vue-router';
import emitter from '@/utils/emitter';
// import { ref } from 'vue';
// import Tooltip from './Tooltip.vue';
const historyList: History[] = useHistoryStore().$state.historyList
const router = useRouter();
// const isVisible = ref(false);
// const isSlidingOut = ref(false);
console.log("historyList",historyList)
    function showAlert() {
      emitter.emit("show-tooltip", { isVisible: true, isSlidingOut: false, tool: "已切换新对话" })
    }


function newChat(historyId: unknown){
  if(!historyId) {
    // alert('您已经开启了一个新对话');
    showAlert();
  } else {
  router.replace({path:'/chat/chatBox',
        })
      }

}
</script>

<style scoped>
.chat-history {
  border-right: 1px rgb(233, 233, 233) solid;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  /* background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  align-items: center;
}
.chat-history-list {
  border-right: 1px rgb(233, 233, 233) solid;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  /* background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  align-items: center;
  overflow-y: auto;
}

.content-box {
  width: 200px;
  padding: 10px 15px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  transition: background-color 0.3s, color 0.3s;
}

/* 鼠标悬停时的样式 */
.content-box:hover {
  /* 设置鼠标悬停时的背景颜色 */
  background-color: #edf0ed;
}


/* 鼠标悬停在父元素时改变大标题的字体颜色 */
.content-box:hover .content {
  /* 设置鼠标悬停时的字体颜色 */
  color: #4CAF50;
}

.content {
  font-size: 13px;
  width: 100%;
   /* 不换行 */
   white-space: nowrap;
  /* 超出部分隐藏 */
  overflow: hidden;
  /* 文本超出时显示省略号 */
  text-overflow: ellipsis;
  margin-bottom: 10px;
  text-align: left;
  color: black;
  /* 设置过渡效果，使颜色变化平滑 */
  transition: color 0.3s;
}

.subContent {
  font-size: 12px;
  width: 100%;
   /* 不换行 */
   white-space: nowrap;
  /* 超出部分隐藏 */
  overflow: hidden;
  /* 文本超出时显示省略号 */
  text-overflow: ellipsis;
  text-align: left;
  color: grey;
}

.router-link {
  text-decoration: none;
  /* 其他样式 */
}



/* CSS 文件 */
.active-router-link {
  background-color: #edf0ed; /* 激活时的背景颜色 */
}

.active-router-link .content {
  color: #4CAF50; /* 激活时内容的字体颜色 */
}

.new-chat {
  width: calc(100% - 20px);
  padding: 10px 0;
  background-color: #4CAF50;
  /* 绿色背景 */
  color: white;
  /* 白色文字 */
  margin: 15px 0;
  /* 外边距 */
  border: none;
  /* 无边框 */
  border-radius: 8px;
  /* 圆角边框 */
  cursor: pointer;
  /* 鼠标悬停时显示指针 */
  font-size: 14px;
  /* 文字大小 */
}

/* 鼠标悬停时的样式 */
.new-chat:hover {
  background-color: #45a049;
  /* 悬停时背景颜色变深 */
}

/* 按钮被点击时的样式 */
.new-chat:active {
  background-color: #3e8e41;
  /* 点击时背景颜色进一步变深 */
}

/* 按钮禁用时的样式 */
.new-chat:disabled {
  background-color: #ccc;
  /* 灰色背景 */
  color: #666;
  /* 灰色文字 */
  cursor: not-allowed;
  /* 鼠标悬停时显示禁止图标 */
}
/* WebKit 内核浏览器样式 */
.chat-history-list::-webkit-scrollbar {
  display: none;
}

/* Firefox 浏览器样式 */
.chat-history-list::-moz-scrollbar {
  display: none;
}

/* IE/Edge 浏览器样式 */
.chat-history-list::-ms-scrollbar {
  display: none;
}
</style>
