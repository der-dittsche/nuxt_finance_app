<script setup lang="ts">
import {useRedirectIfAuthenticated} from "~/composable/isUserLoggedIn";
useRedirectIfAuthenticated()
</script>

<template>
<UCard>
  <template #header>
    Signing in...
  </template>
  Wait a moment while we sign you in...
</UCard>
</template>

<style scoped>

</style>