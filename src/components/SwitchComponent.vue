<template>
  <!-- <Tooltip content="功能开发中..." :isVisible="isVisible" :is-sliding-out="isSlidingOut"/> -->
  <label @click="clickSwitch" class="switch">
    <input
      disabled
      type="checkbox"
      :checked="modelValue"
      @change="toggleSwitch"
    />
    <span class="slider round"></span>
  </label>
   <div style="margin-left: 10px;font-weight: 700;color: rgb(107, 107, 107);">对话</div>
</template>

<script lang="ts" setup name="SwitchComponent">
// import {ref} from 'vue'
// import Tooltip from './Tooltip.vue';
import emitter from "@/utils/emitter"
//数据
// const isVisible = ref(false);
// const isSlidingOut = ref(false);

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

function toggleSwitch(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
}
function clickSwitch() {
  emitter.emit("show-tooltip", { isVisible: true, isSlidingOut: false, tool: "功能开发中..." })
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid rgb(184, 183, 183);
  transition: .4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: rgb(116, 115, 115);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: black;
}

input:checked + .slider:before {
  transform: translateX(22px);
  background-color: white;
}

/* Rounded sliders */
.slider.round {
  border-radius: 28px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
