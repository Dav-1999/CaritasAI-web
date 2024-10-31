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

<style scoped></style>
