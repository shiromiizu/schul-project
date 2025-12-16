'use server'

import { createClient } from '@/utils/supabase/server'
import { updatePasswordSchema } from '@/lib/schemas'

export type UpdatePasswordFormState = {
  errors?: {
    password?: string[]
    confirmPassword?: string[]
    root?: string[]
  }
  message?: string
  success?: boolean
} | null

export async function updatePassword(prevState: UpdatePasswordFormState, formData: FormData): Promise<UpdatePasswordFormState> {
  const validatedFields = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { password } = validatedFields.data
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error('Update password error:', error)
    return {
      errors: {
        root: ['Fehler beim Aktualisieren des Passworts. Bitte versuchen Sie es später erneut.'],
      },
    }
  }

  return {
    success: true,
    message: 'Ihr Passwort wurde erfolgreich aktualisiert.',
  }
}
