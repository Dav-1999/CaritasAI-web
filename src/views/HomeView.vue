<script setup lang="ts">
const counter = useCounterStore()
const title = import.meta.env.VITE_APP_TITLE as string
// 测试本地服务器转发 https://api.caritas.pro/subject/getSubjectList
const resp = ref<ResponseData>()

onMounted(async () => {
  const { data } = await clientFetch<ResponseData>('/subject/getSubjectList').get().json()
  resp.value = data.value

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
