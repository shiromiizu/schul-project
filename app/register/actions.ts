'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { registerSchema } from '@/lib/schemas'

export type RegisterFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    root?: string[]
  }
  message?: string
} | null

export async function signup(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/registered`,
    },
  })

  if (error) {
    console.error('Signup error:', error)
    return {
      errors: {
        root: ['Registrierung fehlgeschlagen. Möglicherweise existiert bereits ein Konto mit dieser E-Mail.'],
      },
    }
  }

  if (data.user) {
    // Determine role
    let role = 'student'
    if (email.endsWith('6072-fuerth.de') && !email.endsWith('schueler.6072-fuerth.de')) {
      role = 'teacher'
    }

    // Insert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, role })

    if (profileError) {
      // If profile creation fails, we might want to delete the user or log it.
      // For now, we'll return an error.
      return {
        errors: {
          root: ['Fehler beim Erstellen des Benutzerprofils: ' + profileError.message],
        },
      }
    }
  }

  redirect('/verify-email')
}
