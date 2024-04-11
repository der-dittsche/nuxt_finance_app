<script setup lang="ts">
const links = [{
  label: 'Profile',
  icon: 'i-heroicons-home',
  to: '/settings/profile'
}, {
  label: 'Avatar',
  icon: 'i-heroicons-user',
  to: '/settings/avatar'
}, {
  label: 'Settings',
  icon: 'i-heroicons-wrench',
  to: '/settings/settings'
}]
</script>

<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="col-span-2 mt-6"/>
    <div class="col-span-4">
      <NuxtPage/>
    </div>

  </div>
</template>

<style scoped>

</style>