<template>
  <div class="grid-container">
    <div class="grid-item" v-for="(item, index) in items" :key="index" @click="sendMessage(item)">
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts" setup name="SearchTerms">
import emitter from '@/utils/emitter';
//数据
const items= ['婚姻的尽头什么', '社恐的人应该怎么去改善自身', '时常感到孤独的人应该何去何从', '人际关系对自身的影响力'];
//方法
function sendMessage(content:string) {
  emitter.emit("send-message", { id: Date.now(), sender: 'user', content: content ,isShowOptions:false,contentType:'text',isRequestOver:true});
  emitter.emit("change-show-input",false)
}
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%; /* 或者具体的宽度 */
  margin-top: 10px;
}

.grid-item {
  width: calc(50% - 27px); /* 两列布局，减去间隙 */
  height: 50px; /* 可以根据实际需要设置高度 */
  margin: 5px 0;
  display: flex;
  justify-content: start;
  padding: 0 10px;
  align-items: center;
  border: 1px solid #ddd; /* 边框 */
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  color: #38584e;
   /* 鼠标悬停时显示指针 */
  cursor: pointer;
}
.grid-item:nth-child(2n) {
  margin-left: 5px; /* 第二列的左边有外边距 */
}

.grid-item:nth-child(2n-1) {
  margin-right: 5px; /* 第一列的右边有外边距 */
}

/* 鼠标悬停时的样式 */
.grid-item:hover {
  background-color: #edf0ed;
  /* 悬停时背景颜色变深 */
}

/* 按钮被点击时的样式 */
.grid-item:active {
  background-color: #d6d6d6;
  /* 点击时背景颜色进一步变深 */
}
</style>
