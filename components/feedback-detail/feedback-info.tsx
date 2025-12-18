import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CategoryRecord } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FeedbackInfoProps {
  feedback: any // Replace with proper type
  isTeacher: boolean
  isAnswered: boolean
}

export function FeedbackInfo({ feedback, isTeacher, isAnswered }: FeedbackInfoProps) {
  const categoryLabel = Object.values(CategoryRecord).find(c => c.value === feedback.category)?.label || feedback.category

  return (
    <Card className="mb-8 border-[0.5px] shadow-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{categoryLabel}</Badge>
              <Badge 
                variant={feedback.seen_by_teacher ? "default" : "secondary"}
                className={cn(
                  "whitespace-nowrap border-transparent",
                  feedback.seen_by_teacher 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                )}
              >
                {feedback.seen_by_teacher ? "Gesehen" : "Offen"}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{feedback.title}</CardTitle>
            <CardDescription>
              Erstellt am {format(new Date(feedback.created_at), "PPP 'um' p", { locale: de })}
              {isTeacher && feedback.profiles && (
                <span className="block mt-1">
                  von {feedback.profiles.full_name} ({feedback.profiles.email})
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{feedback.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
