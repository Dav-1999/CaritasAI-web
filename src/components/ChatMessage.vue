<template>
  <div  class="message" :class="getMessageClasses(message.sender)">
    <img :src="getAvatar(message.sender)" alt="Avatar" class="avatar" :class="message.sender">
    <div class="bubble-container" :class="message.sender">
      <div class="bubble">
        {{ message.text }}
      </div>
      <div v-if="message.sender=='ai' && message.endTheOutput && message.text.indexOf(('你的问题可能偏离了主题')) >=0" class="div-choose">
          <div @click="continueQuestions"><i class="fa fa-check" style="font-size:18px;color: white;margin-right: 10px;"></i>是的，继续</div>
          <div @click="againQuestions"><i class="fa fa-bell" style="font-size:18px;margin-right: 10px;"></i>不完全是，我重新提问</div>
        </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import emitter from '@/utils/emitter';

//数据
const { message } = defineProps(['message']);

//方法
function getAvatar(sender: 'user' | 'ai') {
  return sender === 'user' ? 'https://gd-hbimg.huaban.com/7968f776596196a8061e9ee0ee51c0606d785fc42400b-9aWWPH_fw236' : 'https://www.xiguama.com/content/templates/default/static/images/randem/pic14.jpg';
};

function getMessageClasses(sender:string) {
      return {
        'ai-message': sender === 'ai',
        'user-message': sender === 'user',
        'ai' : sender === 'ai',
        'user': sender === 'user'
      };
};

function continueQuestions(){
  emitter.emit("change-show-input",false)
  // eslint-disable-next-line vue/no-mutating-props
  message.endTheOutput = false;
};

function againQuestions(){
  emitter.emit("change-show-input",true)
  // eslint-disable-next-line vue/no-mutating-props
  message.endTheOutput = false;
}
</script>

<style scoped>
.message {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin: 20px 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.bubble-container {
  position: relative;
  width: calc(100% - 100px);
}

.bubble {
  /* padding: 12px; */
  border-radius: 5px;
  position: relative;
  word-wrap: break-word; /* 允许在单词内部进行换行 */
  overflow-wrap: break-word; /* 允许在长单词或URL内部进行换行 */
  /* max-width: calc(100% - 12px); 限制最大宽度为父元素的宽度 */
  font-size: 16px;
  line-height: 24px;
  display: inline-block;
  /* text-align: start; */
}

.ai-message {
  flex-direction: row; /* AI消息头像在左，内容在右 */
}

.ai-message .avatar {
  order: -1; /* AI消息头像排在前面 */
}

.user-message {
  flex-direction: row;
}

.user-message .avatar {
  order: 1; /* 用户消息头像排在后面 */
  margin-right: 0;
  margin-left: 10px; /* 调整用户消息的头像间距 */
}

.user {
  justify-content: flex-end;
}

.user .bubble-container {
  margin-left: 10px;
  text-align: right;
}

.user .bubble {
  /* background-color: #DCF8C5; */
  padding: 12px;
  max-width: calc(100% - 12px); /* 限制最大宽度为父元素的宽度 */
  background-color: #edf0ed;
  text-align: start;
}

.user .bubble:after {
  right: -12px;
  border-left-color: #DCF8C5;
  transform: translateY(-50%) rotate(45deg);
}

.ai {
  justify-content: flex-start;
}

.ai .bubble-container {
  margin-right: 10px;
  text-align: left;
}

.ai .bubble {
  /* background-color: #E8E8E8; */
  padding: 12px 0;
  max-width: 100%; /* 限制最大宽度为父元素的宽度 */
  color: #333;
  text-align: start;
}

.ai .bubble:after {
  left: -12px;
  border-right-color: #E8E8E8;
  transform: translateY(-50%) rotate(-135deg);
}
.div-choose{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-between;
  margin-top: 20px;
}
.div-choose div{
  display: flex;
  align-items: center;
  padding: 0 15px;
  width: calc(50% - 60px);
  height: 100%;
  border-radius: 25px;
  /* 鼠标悬停时显示指针 */
  cursor: pointer;
}

.div-choose div:nth-child(2n-1){
  background-color: #4CAF50;
  color: white;
}
.div-choose div:nth-child(2n){
  background-color: #edf0ed;
  color: black;
}

/* 鼠标悬停时的样式 */
.div-choose div:nth-child(2n):hover {
  background-color: #e2e4e2;
  /* 悬停时背景颜色变深 */
}

/* 按钮被点击时的样式 */
.div-choose div:nth-child(2n):active {
  background-color: #d6d6d6;
  /* 点击时背景颜色进一步变深 */
}

/* 鼠标悬停时的样式 */
.div-choose div:nth-child(2n-1):hover {
  background-color: #80c480;
  /* 悬停时背景颜色变深 */
}

/* 按钮被点击时的样式 */
.div-choose div:nth-child(2n-1):active {
  background-color: #a6cfa6;
  /* 点击时背景颜色进一步变深 */
}
</style>
