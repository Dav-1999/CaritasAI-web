<script setup lang="ts">

</script>

<template>
  <main>

    <aside>
      边栏
    </aside>
    <article>

      内容组件
    </article>
  </main>
</template>

<style scoped>
main {
  display: flex;
  height: 100vh;
  font-size: 2em;
}

aside {
  flex: 1;
  background-color: #fafafa;
  align-content: center;
  text-align: center;
}

article {
  flex: 3;
  background-color: azure;
  align-content: center;
  text-align: center;
}
</style>
