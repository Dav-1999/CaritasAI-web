<template>
  <div class="nav-wrapper" ref="navWrapper">
    <button v-if="showLeftButton" class="scroll-btn left" @click="scrollNav('left')">❮</button>
    <div :class="['nav-container', isVertical ? 'vertical' : 'horizontal']" ref="navContainer">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="['nav-item', { selected: selectedIdx === index }]"
        @click="selectNavItem(index)"
      >
        {{ item }}
      </div>
    </div>
    <button v-if="showRightButton" class="scroll-btn right" @click="scrollNav('right')">❯</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  isVertical: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    required: true,
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
});

const selectedIdx = ref(props.selectedIndex);
const showLeftButton = ref(false);
const showRightButton = ref(false);
const navWrapper = ref(null);
const navContainer = ref(null);

const emit = defineEmits<{
  (e: 'nav-selected', index: number): void;
}>();

const selectNavItem = (index: number) => {
  selectedIdx.value = index;
  emit('nav-selected', index);
};

// 滚动函数
const scrollNav = (direction: 'left' | 'right') => {
  const container = navContainer.value as unknown as HTMLElement;
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
  const container = navContainer.value as unknown as HTMLElement;
  showLeftButton.value = container.scrollLeft > 0;
  showRightButton.value = container.scrollLeft + container.clientWidth < container.scrollWidth;
};

onMounted(() => {
  updateButtonVisibility();
  // 监听窗口大小变化以重新计算按钮的显示
  window.addEventListener('resize', updateButtonVisibility);
});

watch(
  () => props.items,
  () => {
    updateButtonVisibility();
  }
);
</script>

<style scoped>
.nav-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  max-width: 70vw; /* 避免超出屏幕 */
}

.nav-container {
  display: flex;
  align-items: center;
  --main-color: #6D4F47;
  --secondary-color: #FAE6CC;
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  scrollbar-width: none; /* 隐藏滚动条 */
}

.nav-container::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.nav-item {
  padding: 8px 16px;
  margin: 5px;
  cursor: pointer;
  color: var(--main-color);
  font-weight: bold;
  transition: color 0.3s, font-weight 0.3s;
  position: relative;
}

.nav-item.selected {
  color: var(--main-color);
  font-weight: normal;
  background-color: var(--secondary-color);
  font-weight: bold;
}

/* .nav-item.selected::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 3px;
  background-color: var(--main-color);
  border-radius: 2px;
} */

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
