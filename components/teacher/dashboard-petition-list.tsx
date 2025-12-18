'use client'

import { Petition } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { approvePetition, rejectPetition } from "@/app/teacher/actions"
import { toast } from "sonner"
import { RejectPetitionDialog } from "./reject-petition-dialog"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface DashboardPetitionListProps {
  petitions: Petition[]
}

export function DashboardPetitionList({ petitions }: DashboardPetitionListProps) {
  const handleApprove = async (id: string) => {
    try {
      await approvePetition(id)
      toast.success("Petition angenommen und veröffentlicht")
    } catch (error) {
      toast.error("Fehler beim Annehmen der Petition")
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      await rejectPetition(id, reason)
      toast.success("Petition abgelehnt")
    } catch (error) {
      toast.error("Fehler beim Ablehnen der Petition")
    }
  }

  if (petitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Keine neuen Petitionen.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {petitions.map((petition) => (
        <Card key={petition.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{petition.title}</CardTitle>
                <CardDescription>
                  von {petition.student_name} • {format(new Date(petition.created_at), "PPP", { locale: de })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{petition.description}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleApprove(petition.id)} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Annehmen
              </Button>
              
              <RejectPetitionDialog 
                petitionId={petition.id} 
                onReject={handleReject}
                trigger={
                  <Button size="sm" variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Ablehnen
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
