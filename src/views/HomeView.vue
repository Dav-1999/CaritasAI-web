<script setup lang="ts">
import CounterComp from '@/components/CounterComp.vue'
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>

<template>
  <main>
    cur count: {{ counter.count }}
    <CounterComp />
  </main>
</template>
