<!-- eslint-disable vue/multi-word-component-names -->
<template>
     <!-- 提示框的过渡效果 -->
     <transition name="fade">
    <!-- eslint-disable vue/require-toggle-inside-transition -->
    <div v-if="isVisible" :class="['floating-tooltip', { 'slide-in': !isSlidingOut, 'slide-out': isSlidingOut }]">
    {{content}}
  </div>
    </transition>
</template>

<script lang='ts' setup name="Tooltip">
  defineProps(['content','isVisible','isSlidingOut'])
</script>

<style scoped>
/* 悬浮提示框样式 */
.floating-tooltip {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50; /* 绿色 */
    color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
    width: auto;
    max-width: 300px;
    text-align: center;
    box-sizing: border-box;
    transition: transform 1s, opacity 1s;
  }

  /* 动画类 */
  .slide-in {
    animation: slideInFromTop 0.5s forwards;
  }

  .slide-out {
    animation: slideOutToTop 0.5s forwards;
  }
   /* 动画定义 */
   @keyframes slideInFromTop {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOutToTop {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
</style>
