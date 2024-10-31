<script setup lang="ts">
const counter = useCounterStore()
</script>

<template>
  <main>
    cur count: {{ counter.count }}
    <CounterComp />
  </main>
</template>
