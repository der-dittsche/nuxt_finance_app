<script setup lang="ts">
import {useCurrency} from "~/composable/useCurrency";
import type {Transaction} from "~/types/custom";

const props = defineProps({
  date: String,
  transactions: Array as () => Transaction[]
})

const sum = computed(() => {
  if (!props.transactions) return 0;
  let sum = 0

  for (const transaction of props.transactions) {
    if (transaction.type === 'Income') {
      sum += transaction.amount
    } else {
      sum -= transaction.amount
    }
  }

  return sum
})

const {currency} = useCurrency(sum.value, 'EUR')
</script>

<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-10">
      {{ currency }}
    </div>
  </div>
</template>

<style scoped>

</style>