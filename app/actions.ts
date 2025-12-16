'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { changePasswordSchema } from '@/lib/schemas'

export type ChangePasswordFormState = {
  errors?: {
    currentPassword?: string[]
    newPassword?: string[]
    confirmNewPassword?: string[]
    root?: string[]
  }
  message?: string
  success?: boolean
} | null

export async function changePassword(prevState: ChangePasswordFormState, formData: FormData): Promise<ChangePasswordFormState> {
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmNewPassword: formData.get('confirmNewPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { currentPassword, newPassword } = validatedFields.data
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return {
      errors: {
        root: ['Benutzer nicht gefunden.'],
      },
    }
  }

  // Verify current password by signing in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (signInError) {
    return {
      errors: {
        currentPassword: ['Das aktuelle Passwort ist falsch.'],
      },
    }
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return {
      errors: {
        root: ['Fehler beim Aktualisieren des Passworts: ' + updateError.message],
      },
    }
  }

  return {
    success: true,
    message: 'Passwort erfolgreich geändert.',
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
