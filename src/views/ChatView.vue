<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="chat-view">
    <ChatHistory/>
    <RouterView :key="$route.fullPath"/>
  </div>
</template>

<script lang='ts' setup name="ChatView">
  // import ChatBox from './ChatBox.vue';
  import ChatHistory from '@/components/ChatHistory.vue';
  import {RouterView} from 'vue-router';
</script>

<style scoped>
 .chat-view{
  display: flex;
  background-color: white;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow: hidden;
 }
</style>
