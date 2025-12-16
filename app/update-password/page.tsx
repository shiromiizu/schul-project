'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updatePassword } from './actions'
import { updatePasswordSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  if (state?.success) {
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Passwort aktualisiert</CardTitle>
            <CardDescription>
              {state.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">
                Zum Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Neues Passwort festlegen</CardTitle>
          <CardDescription>
            Bitte geben Sie Ihr neues Passwort ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neues Passwort</FormLabel>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort bestätigen</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state?.errors?.confirmPassword && (
                      <p className="text-sm font-medium text-destructive">{state.errors.confirmPassword[0]}</p>
                    )}
                  </FormItem>
                )}
              />
              {state?.errors?.root && (
                <p className="text-sm font-medium text-destructive">{state.errors.root[0]}</p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Speichern...' : 'Passwort speichern'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
