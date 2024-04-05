<script setup lang="ts">

</script>

<template>
<div class="container mx-auto max-w-4xl">
  <AppHeader />
  <main class="my-10">
    <slot />
  </main>
</div>
</template>

<style scoped>
body {
  font-family: monospace;
}

body {
  @apply dark:bg-gray-900 bg-white
}
</style>