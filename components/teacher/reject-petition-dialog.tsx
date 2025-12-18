'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface RejectPetitionDialogProps {
  petitionId: string
  onReject: (id: string, reason: string) => Promise<void>
  trigger: React.ReactNode
}

export function RejectPetitionDialog({ petitionId, onReject, trigger }: RejectPetitionDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReject = async () => {
    if (!reason.trim()) return
    setIsSubmitting(true)
    try {
      await onReject(petitionId, reason)
      setOpen(false)
      setReason("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Petition ablehnen</DialogTitle>
          <DialogDescription>
            Bitte geben Sie eine Begründung für die Ablehnung an. Der Schüler wird darüber benachrichtigt.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Begründung</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Warum wird diese Petition abgelehnt?"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Abbrechen
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={!reason.trim() || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ablehnen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
