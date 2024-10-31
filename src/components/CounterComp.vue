<template>
  <div>
    <button @click="add">increase</button>
  </div>
</template>

<script setup lang="ts">
const counter = useCounterStore()
function add() {
  console.log('add');
  counter.increment()

}
</script>

<style scoped></style>
