'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { loginSchema } from '@/lib/schemas'

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    root?: string[]
  }
  message?: string
} | null

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validatedFields = loginSchema.safeParse({
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return {
      errors: {
        root: ['Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.'],
      },
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

