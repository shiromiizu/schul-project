import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisteredPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">E-Mail verifiziert</CardTitle>
          <CardDescription>
            Ihre E-Mail wurde erfolgreich verifiziert.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Sie können sich jetzt in Ihr Konto einloggen.
          </p>
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
