'use server'

import { createClient } from '@/utils/supabase/server'
import { forgotPasswordSchema } from '@/lib/schemas'
import { getURL } from '@/lib/utils'
import { redirect } from 'next/navigation'

export type ForgotPasswordFormState = {
  errors?: {
    email?: string[]
    root?: string[]
  }
  message?: string
  success?: boolean
} | null

export async function forgotPassword(prevState: ForgotPasswordFormState, formData: FormData): Promise<ForgotPasswordFormState> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email } = validatedFields.data
  const supabase = await createClient()
  const origin = getURL()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}auth/callback?next=/update-password`,
  })

  if (error) {
    console.error('Forgot password error:', error)
    return {
      errors: {
        root: ['Fehler beim Senden der E-Mail. Bitte versuchen Sie es später erneut.'],
      },
    }
  }

  return {
    success: true,
    message: 'Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.',
  }
}
