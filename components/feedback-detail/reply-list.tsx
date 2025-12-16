import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface ReplyListProps {
  replies: any[] // Replace with proper type
}

export function ReplyList({ replies }: ReplyListProps) {
  if (!replies || replies.length === 0) return null

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-xl font-semibold">Antworten</h3>
      {replies.map((reply) => (
        <Card key={reply.id} className="bg-muted/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{reply.teacher?.full_name || "Lehrer"}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(reply.created_at), "PPP 'um' p", { locale: de })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
