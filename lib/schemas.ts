import { z } from 'zod';
import { Category } from '@/lib/types';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  password: z.string().min(1, { message: 'Passwort ist erforderlich' }),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: 'Ungültige E-Mail-Adresse' })
    .refine(
      (email) => {
        return email.endsWith('schueler.6072-fuerth.de') || email.endsWith('6072-fuerth.de');
      },
      {
        message: 'E-Mail muss auf "schueler.6072-fuerth.de" oder "6072-fuerth.de" enden',
      }
    ),
  password: z.string().min(6, {
    message: 'Passwort muss mindestens 6 Zeichen lang sein.',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Passwort muss mindestens 6 Zeichen lang sein.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

export const feedbackSchema = z.object({
  title: z
    .string({ message: 'Bitte geben Sie einen Titel ein.' })
    .min(1, { message: 'Der Titel darf nicht leer sein.' })
    .max(200, { message: 'Der Titel darf maximal 200 Zeichen lang sein.' })
    .trim(),
  category: z.enum([Category.TEACHER, Category.BUILDING, Category.OTHER] as const, {
    message: 'Bitte Kategorie auswählen.',
  }),
  description: z
    .string({ message: 'Bitte geben Sie eine Beschreibung ein.' })
    .min(10, { message: 'Die Beschreibung muss mindestens 10 Zeichen lang sein.' })
    .max(1000, { message: 'Die Beschreibung darf maximal 1000 Zeichen lang sein.' })
    .trim(),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
