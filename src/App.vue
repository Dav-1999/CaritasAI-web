<script setup lang="ts">
import { onUnmounted ,onMounted,onBeforeMount} from 'vue';
import { useHistoryStore } from './stores/history';
import Tooltip from './components/Tooltip.vue';
import { ref } from 'vue';
import emitter from '@/utils/emitter';

const isVisible = ref(false);
const isSlidingOut = ref(true);
const tool = ref("");
const sidebar_collapsed = ref(true)
onBeforeMount(()=>{
  useHistoryStore().setHistoryListByLocal();
})
  onMounted(()=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emitter.on("show-tooltip",(event:any)=>{
      console.log(event)
      tool.value = event.tool;
      isVisible.value = event.isVisible;
      isSlidingOut.value = event.isSlidingOut;
        setTimeout(() => {
          isSlidingOut.value = true;
          setTimeout(() => {
            isVisible.value = false;
            tool.value = "";
          }, 1000); // 等待动画完成
        }, 3000);
    })
  })
  onUnmounted(()=>{
    console.log("App被卸载了")
    localStorage.setItem('historyList', JSON.stringify(useHistoryStore().$state.historyList));
    emitter.off("show-tooltip");
  })
</script>

<template>
   <Tooltip :content="tool" :isVisible="isVisible" :is-sliding-out="isSlidingOut"/>
   <main class="app-main">
    <aside :style="{ transition: 'width 0.3s', width: sidebar_collapsed ? '40px' : '200px' }">
      <div class="title" :style="{ justifyContent: sidebar_collapsed ? 'center' : 'space-between' }">
        <transition name="fade">
          <h2 v-if="!sidebar_collapsed" :style="{ 'font-family': 'Arial, sans-serif', 'font-style': 'italic' }">Caritas AI</h2>
        </transition>
        <button @click="sidebar_collapsed = !sidebar_collapsed">
          <i :class="!sidebar_collapsed ? 'bi bi-unindent' : 'bi bi-indent'"></i>
        </button>
      </div>
      <transition name="fade">
        <ul v-if="!sidebar_collapsed" :style="{ 'text-align': 'left' }">
          <router-link class="router-link" to="/"><li><i class="bi bi-house" style="margin-right: 10px;font-size: 20px;"></i>Home</li></router-link>
          <router-link class="router-link" to="/chat"><li><i class="bi bi-unity" style="margin-right: 10px;font-size: 20px;"></i>Chat</li></router-link>
          <router-link class="router-link" to="/subject"><li><i class="bi bi-layers" style="margin-right: 10px;font-size: 20px;"></i>Subject</li></router-link>
        </ul>
      </transition>
    </aside>
    <article>
      <RouterView />
    </article>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.app-main {
  display: flex;
  height: 100vh;
  /* font-size: 2em; */
}

.app-main aside {
  width: 24%;
  background-color: #fafafa;
  align-content: top;
  text-align: right;
  transition: width 0.5s;
}
.app-main aside .title{
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.app-main aside .title button{
  border: none;
  background-color: transparent;
  font-size: 18px;
}

.app-main aside .title button:hover {
    color: #555;
    cursor: pointer; /* 改变鼠标样式 */
}

.app-main aside .title h2 {
  padding-right:5px ;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.app-main article {
  height: 100%;
  width: 100%;
  flex: 3;
  background-color: azure;
  align-content: center;
  text-align: center;
}

.app-main ul {
  margin: 0;
  padding: 15px 0;
}

.app-main ul li {
  list-style: none;
  padding: 1em 15px;
  font-size: 18px;
  display: flex;
  align-items: center;

  /* a {
    text-decoration: none;
  } */
}
.app-main ul li:hover{
  background-color: #edf0ed;
  color: #4CAF50;
}
.app-main ul li i{
  font-size: 18px;


}
.app-main .router-link {
  text-decoration: none;
  color: black;
}
.app-main .router-link:hover{
  color: #4CAF50;
}

.app-main .router-link-exact-active {
  color: #4CAF50; /* 激活时内容的字体颜色 */
}

.app-main .router-link-active {
  color: #4CAF50; /* 激活时内容的字体颜色 */
}

</style>
