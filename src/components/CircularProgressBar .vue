<template>
  <svg :width="diameter" :height="diameter" viewBox="0 0 30 30">
    <circle
      class="progress-background"
      cx="15"
      cy="15"
      :r="radius"
      fill="none"
      :stroke="backgroundStroke"
      :stroke-width="strokeWidth"
    />
    <circle
      class="progress-bar"
      cx="15"
      cy="15"
      :r="radius"
      fill="none"
      :stroke="progressStroke"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="strokeDashoffset"
      transform="rotate(-90, 15, 15)"
    />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  diameter?: number;
  strokeWidth?: number;
  progress: number;
  backgroundStroke?: string;
  progressStroke?: string;
}>(), {
  diameter: 30, // 设置直径为30
  strokeWidth: 3, // 根据需要调整线条宽度
  backgroundStroke: '#e6e6e6',
  progressStroke: '#3fb984',
});

const radius = computed(() => (props.diameter - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const strokeDashoffset = computed(() => circumference.value * (1 - props.progress / 100));
</script>

<style scoped>
.progress-background,
.progress-bar {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.progress-bar {
  transition: stroke-dashoffset 0.35s;
}
</style>
