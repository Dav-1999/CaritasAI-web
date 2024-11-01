<script setup lang="ts">
const counter = useCounterStore()
const title = import.meta.env.VITE_APP_TITLE as string
// 测试本地服务器转发 https://api.caritas.pro/article/getTagsMap
const resp = ref('');

onMounted(async () => {
  await fetch(`${import.meta.env.VITE_APP_BASE_URL}/article/getTagsMap`).then(res => res.json()).then(res => {
    resp.value = res
    console.log(resp);

  })
})
</script>

<template>
  <h2>{{ title }}</h2>
  <main>
    cur count: {{ counter.count }}
    <pre>
      {{ resp }}
    </pre>
    <CounterComp />
  </main>
</template>
