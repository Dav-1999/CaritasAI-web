<script setup lang="ts">
</script>

<template>

  <main>

    <aside>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/subject">Subject</router-link></li>
      </ul>
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

li {
  list-style: none;
  margin: 1em;

  a {
    text-decoration: none;
  }
}
</style>
