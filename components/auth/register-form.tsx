'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signup } from '@/app/register/actions'
import { registerSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signup, null)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Registrieren</CardTitle>
        <CardDescription>
          Erstellen Sie ein neues Konto. E-Mail muss auf &#34;schueler.6072-fuerth.de&#34; oder &#34;6072-fuerth.de&#34; enden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input placeholder="name@schueler.6072-fuerth.de" {...field} />
                  </FormControl>
                  <FormMessage />
                  {state?.errors?.email && (
                    <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  {state?.errors?.password && (
                    <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>
                  )}
                </FormItem>
              )}
            />
            {state?.errors?.root && (
              <p className="text-sm font-medium text-destructive">{state.errors.root[0]}</p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Konto erstellen...' : 'Registrieren'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm">
          Sie haben bereits ein Konto?{' '}
          <Link href="/login" className="underline">
            Anmelden
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}