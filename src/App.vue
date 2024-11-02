<script setup lang="ts">
const sidebar_collapsed = ref(true)
</script>

<template>
  <main>
    <aside :style="{ width: sidebar_collapsed ? '8%' : '24%' }">
      <ul :style="{ display: sidebar_collapsed ? 'none' : 'block' }">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/subject">Subject</router-link></li>
      </ul>
      <button @click="sidebar_collapsed = !sidebar_collapsed">fold</button>
    </aside>
    <article>
      <RouterView />
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
  width: 24%;
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

li {
  list-style: none;
  margin: 1em;

  a {
    text-decoration: none;
  }
}
</style>
