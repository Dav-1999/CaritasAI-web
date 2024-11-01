<script setup lang="ts">
const counter = useCounterStore()
const title = import.meta.env.VITE_APP_TITLE as string
// 测试本地服务器转发 https://api.caritas.pro/subject/getSubjectList
const resp = ref<ResponseData | null>(null)

onMounted(async () => {
  await fetch(`${import.meta.env.VITE_APP_BASE_URL}/subject/getSubjectList`).then(res => res.json()).then(res => {
    const data = res as ResponseData
    resp.value = data
    console.log(resp.value.data);

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
