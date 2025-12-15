import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
})

export const registerSchema = z.object({
  email: z.string().email().refine((email) => {
    return email.endsWith('schueler.6072-fuerth.de') || email.endsWith('6072-fuerth.de')
  }, {
    message: 'Email must end with "schueler.6072-fuerth.de" or "6072-fuerth.de"',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})
