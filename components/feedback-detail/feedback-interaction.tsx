'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { markAsRead, addReply } from "@/app/feedback/[id]/actions"
import { Loader2, CheckCircle, Send } from "lucide-react"
import { toast } from "sonner"

interface FeedbackInteractionProps {
  feedbackId: string
  isTeacher: boolean
  seenByTeacher: boolean
}

export function FeedbackInteraction({ feedbackId, isTeacher, seenByTeacher }: FeedbackInteractionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")

  if (!isTeacher) return null

  const isValid = replyMessage.trim().length >= 10 && replyMessage.trim().length <= 1000;

  const handleMarkAsRead = async () => {
    try {
      setIsSubmitting(true)
      await markAsRead(feedbackId)
      toast.success("Als gelesen markiert")
    } catch (error) {
      toast.error("Fehler beim Aktualisieren")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async () => {
    if (!isValid) return

    try {
      setIsSubmitting(true)
      await addReply(feedbackId, replyMessage)
      setReplyMessage("")
      toast.success("Antwort gesendet")
    } catch (error) {
      toast.error("Fehler beim Senden der Antwort")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 mt-8 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aktionen</h3>
        {!seenByTeacher && (
          <Button 
            variant="outline" 
            onClick={handleMarkAsRead} 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Als gelesen markieren
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Antworten</h4>
        <div className="space-y-2">
          <Textarea
            placeholder="Schreiben Sie eine Antwort (10-1000 Zeichen)..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={4}
            className={!isValid && replyMessage.length > 0 ? "border-destructive" : ""}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={replyMessage.length > 0 && replyMessage.length < 10 ? "text-destructive" : ""}>
              Min. 10 Zeichen
            </span>
            <span className={replyMessage.length > 1000 ? "text-destructive" : ""}>
              {replyMessage.length}/1000
            </span>
          </div>
        </div>
        <Button onClick={handleReply} disabled={isSubmitting || !isValid}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Antwort senden
        </Button>
      </div>
    </div>
  )
}
