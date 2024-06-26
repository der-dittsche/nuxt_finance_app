<script setup lang="ts">
import {useCurrency} from "~/composable/useCurrency"
import type {Transaction} from "~/types/custom"
import {sleep} from "@antfu/utils";
import {useAppToast} from "~/composable/useAppToast";

const props = defineProps({
  transaction: {
    type: Object as () => Transaction,
    required: true
  }
});

const isOpen = ref(false)

const emit = defineEmits(['deleted', 'edited'])

const {currency} = useCurrency(props.transaction?.amount ?? 0, 'EUR');

const isLoading = ref(false)
const { toastError, toastSuccess } = useAppToast()

const supabase = useSupabaseClient()
const deleteTransaction = async () => {
  isLoading.value = true

  try {
    await supabase
        .from('transactions')
        .delete()
        .eq('id', props.transaction.id)
    toastSuccess({title: 'Transaction deleted'})
    emit('deleted', props.transaction.id)
  } catch (error) {
    toastError({title: 'Transaction was not deleted'})
  } finally {
    await sleep(1000)
    isLoading.value = false
  }
}

const items = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => isOpen.value = true
  },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction
    }]
]
const isIncome = computed(() => props.transaction?.type === 'Income')

const icon = computed(
    () => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)

const iconColor = computed(
    () => isIncome.value ? 'text-green-600' : 'text-red-600'
)
</script>

<template>
  <div class="grid grid-cols-4 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-3">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]"/>
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">{{ transaction.category }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :propper="{placement: 'bottom-start'}">
          <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading"/>
          <modal-transaction v-model="isOpen" :transaction="transaction" @saved="emit('edited')" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>