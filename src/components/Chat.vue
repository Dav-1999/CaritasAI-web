<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="chat">
    <ChatHistory/>
    <RouterView :key="$route.fullPath"/>
  </div>
</template>

<script lang='ts' setup name="Chat">
  // import ChatBox from './ChatBox.vue';
  import ChatHistory from './ChatHistory.vue';
  import {RouterView} from 'vue-router';
</script>

<style scoped>
 .chat{
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow: hidden;
  background-color: red;
 }
</style>
