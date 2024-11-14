<template>
  <div class="tab-wrapper" ref="tabWrapper">
    <button v-if="showLeftButton" class="scroll-btn left" @click="scrollTabs('left')">❮</button>
    <div :class="['tab-container', isVertical ? 'vertical' : 'horizontal']" ref="tabContainer">
      <div v-if="hasSetAll&&tabs.length" ref = "allSelector" class="tab activated" @click="selectAll">
        全部
      </div>
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab', { selected: selectedIdx === index }]"
        @click="selectTab(index)"
      >
        {{ tab }}
      </div>
    </div>
    <button v-if="showRightButton" class="scroll-btn right" @click="scrollTabs('right')">❯</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';

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
    default: -1,
  },
  hasSetAll: {
    type: Boolean,
    default: false,
  }
});

const selectedIdx = ref(props.selctedIndex);
const showLeftButton = ref(false);
const showRightButton = ref(false);
const tabWrapper = ref(null);
const tabContainer = ref(null);
const allSelector = ref<null |　HTMLElement>(null);
const emit = defineEmits<{
  (e: 'tab-selected', index: number): void;
  (e: 'select-all'): void;
}>();

const selectTab = (index: number) => {
  if (allSelector.value?.classList.contains('activated')) {
    allSelector.value?.classList.remove('activated');
  }
  selectedIdx.value = index;
  emit('tab-selected', index);
};

const selectAll = () => {
  selectedIdx.value = -1;
  // switch e avtivated
  if (!allSelector.value?.classList.contains('activated')) {
    allSelector.value?.classList.add('activated');
  }
  emit('select-all');
}

// 滚动函数
const scrollTabs = (direction: 'left' | 'right') => {
  const container = tabContainer.value as unknown as HTMLElement;
  const scrollAmount = 100; // 每次滚动的像素值
  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
  updateButtonVisibility();
};

// 检查溢出并更新按钮的可见性
const updateButtonVisibility = () => {
  const container = tabContainer.value as unknown as HTMLElement;
  showLeftButton.value = container.scrollLeft > 0;
  showRightButton.value = container.scrollLeft + container.clientWidth < container.scrollWidth;
};

onMounted(() => {
  updateButtonVisibility();
  // 监听窗口大小变化以重新计算按钮的显示
  window.addEventListener('resize', updateButtonVisibility);
});

watch(
  () => props.tabs,
  () => {
    updateButtonVisibility();
  }
);
</script>

<style scoped>
.tab-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  max-width: 70vw; /* 避免超出屏幕 */

}

.tab-container {
  display: flex;
  align-items: center;
  --main-color: #49241A;
  --secondary-color: #FAE6CC;
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  scrollbar-width: none; /* 隐藏滚动条 */
}

.tab-container::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.tab {
  padding: 8px 12px;
  margin: 6px;
  cursor: pointer;
  color: var(--main-color);
  border-radius: 4px;
  height: 20px;
  font-weight: normal;
  transition: background-color 0.8s, font-weight 0.5s, opacity 0.3s;
}

.tab.selected {
  background-color: var(--secondary-color);
  /* font-weight: bold; */
  opacity: 0.8;
}

.tab.activated {
  background-color: var(--secondary-color);
  font-weight: bold;
}

.scroll-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  padding: 0 8px;
}

.scroll-btn.left {
  margin-right: -4px;
}

.scroll-btn.right {
  margin-left: -4px;
}
</style>
