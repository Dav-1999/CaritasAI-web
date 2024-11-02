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
    <aside :style="{ width: sidebar_collapsed ? '40px' : '200px' }">
      <div class="title" :style="{'justify-content':sidebar_collapsed? 'center' : 'space-between'}">
        <h2 :style="{ display: sidebar_collapsed ? 'none' : 'block','font-family': 'Arial, sans-serif','font-style': 'italic'}">Caritas AI</h2>
        <button @click="sidebar_collapsed = !sidebar_collapsed"><i :class="!sidebar_collapsed?'fa fa-arrow-left':'fa fa-arrow-right'"></i></button>
      </div>
      <ul :style="{ display: sidebar_collapsed ? 'none' : 'block','text-align':'left'}">
        <li><router-link class="router-link" to="/"><i class="bi bi-search-heart" style="margin-right: 10px;font-size: 20px;"></i>Home</router-link></li>
        <li><router-link class="router-link" to="/chat"><i class="bi bi-unity" style="margin-right: 10px;font-size: 20px;"></i>Chat</router-link></li>
        <li><router-link class="router-link" to="/subject"><i class="bi bi-layout-text-window-reverse" style="margin-right: 10px;font-size: 20px;"></i>Subject</router-link></li>
      </ul>
    </aside>
    <article>
      <RouterView />
    </article>
  </main>
</template>

<style scoped>
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
}
.app-main aside .title{
  height: 40px;
  display: flex;
  align-items: center;
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
  padding: 15px;
}

.app-main ul li {
  list-style: none;
  margin: 2em 0;
  font-size: 18px;

  a {
    text-decoration: none;
  }
}
.app-main ul li i{
  font-size: 18px;


}
.app-main .router-link {
  text-decoration: none;
  color: black;
}

.app-main .router-link-exact-active {
  color: #4CAF50; /* 激活时内容的字体颜色 */
}

.app-main .router-link-active {
  color: #4CAF50; /* 激活时内容的字体颜色 */
}

</style>
