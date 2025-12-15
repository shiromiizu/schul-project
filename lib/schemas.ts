import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  password: z.string().min(1, { message: 'Passwort ist erforderlich' }),
})

export const registerSchema = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }).refine((email) => {
    return email.endsWith('schueler.6072-fuerth.de') || email.endsWith('6072-fuerth.de')
  }, {
    message: 'E-Mail muss auf "schueler.6072-fuerth.de" oder "6072-fuerth.de" enden',
  }),
  password: z.string().min(6, {
    message: 'Passwort muss mindestens 6 Zeichen lang sein.',
  }),
})
