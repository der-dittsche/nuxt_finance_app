<script setup lang="ts">import {useCurrency} from "~/composable/useCurrency";

const {currency} = useCurrency(3000, 'EUR')

const items = [
[{
  label: 'Edit',
  icon: 'i-heroicons-pencil-square-20-solid',
  click: () => console.log('edit')
},
{
  label: 'Delete',
      icon:'i-heroicons-trash-20-solid',
      click:  () => console.log('delete')
}]
]
</script>

<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-arrow-up-right" class="text-green-600"/>
        <div>Salary</div>
      </div>
      <div>
        <UBadge color="white">Category</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :propper="{placement: 'bottom-start'}">
          <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>