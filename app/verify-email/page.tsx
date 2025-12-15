import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">E-Mail überprüfen</CardTitle>
          <CardDescription>
            Wir haben Ihnen einen Bestätigungslink gesendet. Bitte überprüfen Sie Ihre E-Mails, um Ihr Konto zu verifizieren.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Sobald Sie verifiziert sind, können Sie sich in Ihr Konto einloggen.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              Zurück zum Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
