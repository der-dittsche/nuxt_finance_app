<script setup lang="ts">
import {useAppToast} from "~/composable/useAppToast";
import {useAvatarUrl} from "~/composable/useAvatarUrl";

const {url} = useAvatarUrl()

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {toastSuccess, toastError} = useAppToast()

const uploading = ref(false)
const fileInput = ref()

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0]
  if (!file) {
    toastError({title: 'Select a file to upload'})
    return
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`

  try {
    uploading.value = true

    const currentAvatarUrl = user.value!.user_metadata?.avatar_url
    const { error } = await supabase.storage.from('avatar')
        .upload(fileName, file)
    if(error) {
      console.log(error)
    }

    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })
    if (currentAvatarUrl) {
      const { error } = await supabase.storage.from('avatar')
          .remove([currentAvatarUrl])
      if(error) {
        console.log(error)
      }
    }

    fileInput.value.input.value = null

    toastSuccess({
      title: 'Avatar uploaded',
    })
  } catch (error:any) {
    toastError({
      title: 'Error uploading avatar',
      description: error.message
    })
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar :src="url" size="3xl" class="mt-3"/>
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup label="New avatar" class="w-full" name="avatar"
                  help="After choosing an image click Save to actually upload the new avatar">
        <UInput type="file" ref="fileInput"/>
      </UFormGroup>
    </div>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
             @click="saveAvatar"/>
  </div>
</template>

<style scoped>

</style>