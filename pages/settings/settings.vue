<script setup lang="ts">
import {useAppToast} from "~/composable/useAppToast";
import {transactionViewOptions} from "~/constants";

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)
const state = ref({
  transactionView: user.value!.user_metadata?.transaction_view ?? transactionViewOptions[1]
})

const saveSettings = async () => {
  pending.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView
      }
    })
    if (error)
    toastSuccess({
      title: 'Settings updated',
    })
  }
  catch (error) {
    toastError({
      title: 'Error updating settings',
      description: error.message,
    })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UForm :state="state"  @submit="saveSettings">
    <UFormGroup label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
      <USelect :options="transactionViewOptions" v-model="state.transactionView" />
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<style scoped>

</style>