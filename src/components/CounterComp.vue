<template>
  <div>
    <button @click="add"><svg-icon icon-class="sailboat" />increase</button>
  </div>
</template>

<script setup lang="ts">
const counter = useCounterStore()
function add() {
  console.log('add')
  counter.increment()
}
</script>

<style scoped>
button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 2rem;
  background-color: azure;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
