<template>
  <div class="subject-container">
    <header>
      <div>栏目列表</div>
      <button @click="subproblem_list_collasped = !subproblem_list_collasped">
        子问题
      </button>
    </header>
    <main>
      <article>内容区域
        <p v-if="subjectResp.isFetching">loading</p>
        <pre v-else style="font-size: small;">
            {{ subjectResp.data }}
        </pre>
      </article>
      <aside :style="{ display: subproblem_list_collasped ? 'none' : 'flex' }">
        子问题区域
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
const subproblem_list_collasped = ref(true)


const getSubjectList = () =>{
  const { isFetching, error, data } = useFetch<ResponseData>('https://httpbin.org/delay/4').get()
  return ref({ isFetching, error, data })
}

const subjectResp = getSubjectList()
</script>

<style scoped>
.subject-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 50px;
  background-color: tomato;
}

main {
  display: flex;
  flex: 1;
}

article {
  flex: 4;
  background-color: cadetblue;
}

aside {
  flex: 2;
  background-color: beige;
}
</style>
