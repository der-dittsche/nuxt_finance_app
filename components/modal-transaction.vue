<script setup lang="ts">
import {z} from 'zod'
import {transactionType, transactionCategories} from "~/constants";
import {useAppToast} from "~/composable/useAppToast";

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false
  }
})

const isEditing = computed(() => !!props.transaction)

const emit = defineEmits(['update:modelValue', 'saved'])

// schema definition find on https://zod.dev/

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0')
})
const incomeSchema = z.object({
  type: z.literal('Income')
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(['Food', 'Bill', 'Housing', 'Car', 'Entertainment', 'other'])
})
const investmentSchema = z.object({
  type: z.literal('Investment')
})
const savingSchema = z.object({
  type: z.literal('Saving')
})
const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
    defaultSchema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const { toastError, toastSuccess } = useAppToast()

const save = async () => {
  isLoading.value = true
  try {
    const transactionData: any = {
      type: transactionInput.value.type,
      amount: transactionInput.value.amount,
      created_at: transactionInput.value.created_at,
      description: transactionInput.value.description,
      categories: transactionInput.value.categories
    }
    const {error}: any = await supabase.from('transactions')
        .upsert({...transactionData, id: props.transaction?.id})
    if (!error) {
      toastSuccess({
        'title': 'Transaction saved'
      })
      isOpen.value = false
      emit('saved')
      return
    }
  } catch (e: any) {
    toastError({
      title: 'Transaction not saved',
      description: e.message
    })
  } finally {
    isLoading.value = false
  }
}

const initialState = isEditing.value ? {
  type: props.transaction!.type,
  amount: props.transaction!.amount,
  created_at: props.transaction!.created_at.split('T')[0],
  description: props.transaction!.description,
  categories: props.transaction!.categories
} : {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  categories: undefined
}

const transactionInput = ref({...initialState})

const resetForm = () => {
  Object.assign(transactionInput.value, initialState)
  if (form.value) {
    form.value.clear()
  }
}

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm()
    emit('update:modelValue', value)
  }
})

</script>

<template>
  <UModal v-model="isOpen" :transition="false">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-gray-500 dark:text-gray-400">
            {{ isEditing ? 'Edit' : 'Add' }} Transaction
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                   @click="isOpen = !isOpen"/>
        </div>
      </template>
      <UForm :state="transactionInput" @submit="save" :ref="form" :schema="schema">
        <UFormGroup label="Transaction Type" :required="true" name="type" class="mb-4">
          <USelect
              :disabled="isEditing"
              placeholder="select the transaction type"
              :options="transactionType"
              v-model="transactionInput.type"
          />
        </UFormGroup>
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
              type="number"
              placeholder="amount"
              v-model="transactionInput.amount"
          />
        </UFormGroup>
        <UFormGroup label="Transaction Date" :required="false" name="created_at" class="mb-4">
          <UInput
              type="date"
              icon="i-heroicons-calendar-days-20-solid"
              v-model="transactionInput.created_at"
          />
        </UFormGroup>
        <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
          <UInput
              placeholder="some information about this transaction"
              icon="i-heroicons-pencil-square"
              v-model="transactionInput.description"
          />
        </UFormGroup>
        <UFormGroup label="Category" :required="true" name="category" class="mb-4"
                    v-if="transactionInput.type == 'Expense'">
          <USelect
              placeholder="select a category"
              :options="transactionCategories"
              v-model="transactionInput.categories"

          />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="save" :loading="isLoading"/>
      </UForm>

    </UCard>
  </UModal>
</template>

<style scoped>

</style>