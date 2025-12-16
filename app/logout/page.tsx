'use client'

import { logout } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Bereits angemeldet</CardTitle>
          <CardDescription>
            Sie sind bereits mit einem Konto angemeldet. Möchten Sie sich abmelden?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <form action={logout}>
            <Button variant="destructive">
              Abmelden
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
