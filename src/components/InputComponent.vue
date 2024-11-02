<template>
  <div
    ref="msgInput"
    class="msg-input"
    contenteditable="true"
     @input="onInput"
     @keyup.enter="emit('send-message')"
  >{{ modelValue }}</div>
</template>

<script lang="ts" setup name="InputComponent">
import {defineProps, defineEmits } from 'vue';

// 接收props
defineProps(['modelValue'])
  // 声明事件
const emit = defineEmits(['update:model-value','send-message'])


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onInput(event:any) {
      // 确保event.target存在
      if (event.target) {
        emit('update:model-value', event.target.innerText);
      }
    }
</script>

<style scoped>
.msg-input {
  text-align: left;
  font-size: 17px;
  line-height: 25px;
  /* border: solid 1px #999; */
  min-height: 25px; /* 确保有足够的高度显示内容 */
  max-height: 120px;
  outline: none; /* 移除聚焦时的边框 */
  width: calc(100% - 40px);
  padding: 10px 10px;
  margin: 10px;
  overflow: scroll;
  font-weight:bold;
  /* border: 1px solid #ccc;
  border-radius: 45px; */
}

.msg-input:empty::before {
  content: "输入消息...";
  color: #999999;
}

.msg-input:focus::before {
  content: none;
}

/* WebKit 内核浏览器样式 */
.msg-input::-webkit-scrollbar {
  display: none;
}

/* Firefox 浏览器样式 */
.msg-input::-moz-scrollbar {
  display: none;
}

/* IE/Edge 浏览器样式 */
.msg-input::-ms-scrollbar {
  display: none;
}
</style>
