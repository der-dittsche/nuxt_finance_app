<script setup lang="ts">
import {z} from 'zod'
import {useAppToast} from "~/composable/useAppToast";

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {toastError, toastSuccess} = useAppToast()
const pending = ref(false)

const userInformation = ref({
  name: user.value?.user_metadata?.full_name,
  email: user.value?.email
})

const schema = z.object({
  name: z.string().min(10).optional(),
  email: z.string().email()
})

const saveProfile = async () => {
  pending.value = true
  try {
    const data: {data: {full_name: any; email?: any }} = {
      data: {
        full_name: userInformation.value.name
      }
    };
    if (user.value && userInformation.value.email !== user.value.email) {
      data.data.email = userInformation.value.email;
    }

    console.log(data)

    const { error } = await supabase.auth.updateUser(data)

    if (error) {
      toastError({
        title: 'Error updating profile',
        description: (error as Error).message
      })
    } else {
      toastSuccess({
        title: 'Profile updated',
        description: 'Your profile has been updated'
      })
    }
  } finally {
    pending.value = false
  }
}

</script>

<template>
  <UForm :state="userInformation" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="userInformation.name" />
    </UFormGroup>
    <UFormGroup class="mb-4" label="Email" name="email"
                help="You will receive a confirmation email on both the old and the new addresses if you modify the email address">
      <UInput v-model="userInformation.email" />
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<style scoped>

</style>