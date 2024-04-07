<script setup lang="ts">
import {useCurrency} from "~/composable/useCurrency";

interface Transaction {
  id: number;
  created_at: string;
  amount: number;
  type: string | null;
  description: string | null;
  category: string | null;
}

const props = defineProps({
  transaction: {
    type: Object as () => Transaction,
    required: true
  }
});

const { currency } = useCurrency(props.transaction?.amount ?? 0, 'EUR');

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
const isIncome = computed(()=> props.transaction?.type === 'Income')

const icon = computed(
    () => isIncome.value  ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)

const iconColor = computed(
    () => isIncome.value ? 'text-green-600' : 'text-red-600'
)
</script>

<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]"/>
        <div >{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">{{ transaction.category }}</UBadge>
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