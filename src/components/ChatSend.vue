<template>
  <div v-if="showInput" class="input-container" :class="{'input-container-value':!chatType}">
    <div v-if="!chatType" class="div-title">你想知道什么？</div>
    <div style="width: calc(100% - 4px);border:   2px solid rgb(184, 183, 183);border-radius: 6px;">
    <!-- <textarea ref="textarea" type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="请输入消息..." /> -->
    <InputComponent v-model="inputMessage" @send-message="sendMessage" />
    <div class="button-container">
      <SwitchComponent v-model="switchValue" />
      <button @click="sendMessage"><i class="fa fa-arrow-right" style="font-size:18px"></i></button>
    </div>
  </div>
    <SearchTerms v-if="!chatType"/>
  </div>
</template>

<script lang='ts' setup name="ChatSend">
import { ref ,onMounted,onUnmounted} from 'vue';
import emitter from '../utils/emitter'
import InputComponent from './InputComponent.vue';
import SwitchComponent from './SwitchComponent.vue';
import SearchTerms from './SearchTerms.vue';
//数据
const inputMessage = ref("");
const switchValue = ref(false);
const props = defineProps(['chatType']);
const showInput = ref(!props.chatType)

//方法
function sendMessage() {
  if (inputMessage.value.trim() === '') return;
  emitter.emit("send-message", { id: Date.now(), sender: 'user', text: inputMessage.value ,endTheOutput:true});
  inputMessage.value = '';
  showInput.value = false;

}

onMounted(()=>{
  emitter.on("change-show-input",(event)=>{
    console.log(event);
    showInput.value = event as boolean
  })
})
onUnmounted(()=>{
  emitter.off("change-Show-input")
})
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 40%;
  padding-top: 10px;
}

.input-container-value {
  position: absolute;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}

.div-title{
  font-size: 35px;
  text-align: center;
  width: 100%;
  font-weight: 500;
  margin-bottom: 20px;
  color: #38584e;
}

.button-container {
  width: calc(100% - 20px);
  display: flex;
  flex-direction: row;
  justify-content: end;
  text-align: right;
  align-items: center;
  padding: 10px 10px;
}

.input-container button {
  height: 38px;
  width: 38px;
  border: none;
  align-items: center;
  justify-content: center;
  /* background-color: #659bd494; */
  background-color: rgb(240, 240, 240);
  color: white;
  border-radius: 38px;
  cursor: pointer;
  margin-left: 20px;
  color: rgb(189, 189, 189);
}
</style>
