<template>
  <div :class="['tab-container', isVertical ? 'vertical' : 'horizontal']">
    <div v-for="(tab, index) in tabs" :key="index" :class="['tab', { selected: selectedIdx === index }]"
      @click="selectTab(index)">
      {{ tab }}
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  isVertical: {
    type: Boolean,
    default: false,
  },
  tabs: {
    type: Array,
    required: true,
  },
  selctedIndex: {
    type: Number,
    default: 0,
  }
});

const selectedIdx = ref(props.selctedIndex);

// 定义 emit 事件
const emit = defineEmits<{
  (e: 'tab-selected', index: number): void;
}>();


const selectTab = (index: number) => {
  selectedIdx.value = index;
  emit('tab-selected', index); // 发出选中事件
};
</script>

<style scoped>
.tab-container {
  display: flex;
  align-items: center;

  /* 允许水平布局时自动换行 */
  &.horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: auto;
  }

  /* 允许垂直布局时自动滚动 */
  &.vertical {
    flex-direction: column;
    overflow-y: auto;
    max-height: 80vh;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #008080;
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
}

.tab {
  padding: 8px 16px;
  margin: 5px;
  cursor: pointer;
  color: #20545e;
  border-radius: 4px;
  height: 20px;
  font-weight: bold;
  transition: background-color 0.3s, font-weight 0.3s, opacity 0.3s;
}

.tab.selected {
  background-color: #e0f3f5;
  font-weight: normal;
  opacity: 0.8;
}
</style>
